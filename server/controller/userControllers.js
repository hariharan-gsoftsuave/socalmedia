const { Router, json } = require('express');
const HttpError = require('../models/errorModel');
const userModel = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
//const uuid = require('uuid').v4;
const fs = require("fs");
const path = require("path");
//const cloudinary = require("../utils/cloudinary");
const { v4: uuid } = require('uuid');
const cloudinary = require('cloudinary').v2;

//==================    * * * REGISTER USER * * *   ========================
//POST : api/users/register
//UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmpassword } = req.body;
    if (!fullName || !email || !password || !confirmpassword) {
      return next(new HttpError('Fill in all fields', 422));
    }

    const lowercaseemail = email.toLowerCase();

    const emailExist = await userModel.findOne({ email: lowercaseemail });
    if (emailExist) {
      return next(new HttpError("Email already exists", 422));
    }

    if (password !== confirmpassword) {
      return next(new HttpError("Passwords do not match", 422));
    }

    if (password.length < 6) {
      return next(new HttpError("Password should be at least 6 characters", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullName,
      email: lowercaseemail,
      password: hashedPassword
    });

    res.status(201).json(newUser);
  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

//==================    * * * LOGIN USER * * *   ========================
//POST : api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Fill in all fields", 422));
    }

    const lowercaseemail = email.toLowerCase();

    // Await the DB query!
    const user = await userModel.findOne({ email: lowercaseemail });

    if (!user) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const comparedpass = await bcrypt.compare(password, user.password);

    if (!comparedpass) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    const { password: _, ...userinfo } = user.toObject(); // remove password from user data
    res.status(200).json({ token, id: user._id, ...userinfo });
  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

//==================    * * * GET USER * * *   ========================
//GET : api/users/:id
//PROTECTED
const getUser =async(req,res,next)=>{
    try{
        const {id} = req.params;
        const user = await userModel.findById(id).select('-password');;
        if(!user){
            return next(new HttpError("User not found",422))
        }
        res.json(user).status(200)
    }catch(error){
        return next(new HttpError(error))
    }
};

//==================    * * * GET USERs * * *   ========================
//GET : api/users
//PROTECTED
const getUsers =async(req,res,next)=>{
    try{
       const users = await userModel.find().select('-password');
        res.json(users);    
    }catch(error){
        return next(new HttpError(error))
    }
};

//==================    * * * EDIT USER * * *   ========================
//PATCH : api/users/edit
//PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { fullName, bio } = req.body;

    const editedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { fullName, bio },
      { new: true }
    );
    const userWithoutPassword = editedUser.toObject();
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};

//==================    * * * FOLLOW/UNFOLLOW USER * * *   ========================
//PATCH : api/users/follow-unfollow/:id
//PROTECTED
const followUnfollowUser = async (req, res, next) => {
  try {
    const userToFollowId = req.params.id;

    // Prevent self-follow
    if (req.user.id === userToFollowId) {
      return next(new HttpError("You can't follow yourself", 422));
    }

    const currentUser = await userModel.findById(req.user.id);
    const isFollowing = currentUser?.following?.includes(userToFollowId);

    let updatedUser;

    if (!isFollowing) {
      // Follow user
      await userModel.findByIdAndUpdate(userToFollowId, {
        $addToSet: { followers: req.user.id },
      });

      await userModel.findByIdAndUpdate(req.user.id, {
        $addToSet: { following: userToFollowId },
      });

      updatedUser = await userModel.findById(userToFollowId).select('-password');
    } else {
      // Unfollow user
      await userModel.findByIdAndUpdate(userToFollowId, {
        $pull: { followers: req.user.id },
      });

      await userModel.findByIdAndUpdate(req.user.id, {
        $pull: { following: userToFollowId },
      });

      updatedUser = await userModel.findById(userToFollowId).select('-password');
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    return next(new HttpError(error.message || 'Something went wrong', 500));
  }
};


//==================    * * * CHANGE USER PROFILE PHOTO * * *   ========================
//POST : api/users/avatar
//PROTECTED
const changeUserAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }

    const { avatar } = req.files;

    if (avatar.size > 500000) {
      return next(new HttpError("Profile picture too big. Should be less than 500kb", 422));
    }

    const fileExt = path.extname(avatar.name); // e.g., ".png"
    const baseName = path.basename(avatar.name, fileExt); // e.g., "profile"
    const newFileName = `${baseName}-${uuid()}${fileExt}`;
    const uploadPath = path.join(__dirname, "..", "uploads", newFileName);

    // Move file to uploads folder
    avatar.mv(uploadPath, async (err) => {
      if (err) {
        return next(new HttpError("Failed to save the file locally", 500));
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
          resource_type: "image",
        });

        if (!result?.secure_url) {
          return next(new HttpError("Couldn't upload image to Cloudinary", 422));
        }

        // Update user profile photo
        const updatedUser = await userModel.findByIdAndUpdate(
          req.user.id,
          { profilePhoto: result.secure_url },
          { new: true },
        ).select('-password');

        // Delete the local file after upload
        fs.unlink(uploadPath, (err) => {
          if (err) console.error("Failed to delete local image:", err);
        });

        res.status(200).json(updatedUser);

      } catch (cloudErr) {
        return next(new HttpError(cloudErr ||"Cloudinary upload failed", 500));
      }
    });

  } catch (error) {
    return next(new HttpError(error || "Something went wrong", 500));
  }
};
//==================    * * * GOOGLE LOGIN * * *   ========================
//POST : api/users/google-login
//UNPROTECTED

const Googlelogin = async (req, res) => {
  try {
    const { name, email, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        password: null, // Google users don't need a password
      });
    }
    const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    };


    const token = generateToken(user._id);

    res.status(200).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      googleId: user.googleId,
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({
      message: "Failed to login with Google",
      error: error.message,
    });
  }
};

module.exports = {registerUser,loginUser,getUser,getUsers,editUser,followUnfollowUser,changeUserAvatar,Googlelogin};