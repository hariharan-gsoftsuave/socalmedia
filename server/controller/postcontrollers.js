const HttpError = require('../models/errorModel');
const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');


const {v4:uuid}=require('uuid');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const { rejects } = require('assert');
const { constants } = require('buffer');

//============================ ***** create post ***** ====================
// PPOST : api/post
//PROTECTED
const imageMove = util.promisify(fs.rename); // if you're using 'mv' from express-fileupload, you can use util.promisify for async/await

const createPost = async (req, res, next) => {
    try {
        const { body } = req.body;

        if (!body || !req.files || !req.files.image) {
            return next(new HttpError('Fill in text field and choose an image', 422));
        }

        const image = req.files.image;

        if (image.size > 1000000) {
            return next(new HttpError("Profile picture too big. Should be less than 1000KB", 422));
        }

        let fileName = image.name;
        const fileParts = fileName.split(".");
        fileName = fileParts[0] + uuid() + "." + fileParts[fileParts.length - 1];

        const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

        // Move the file
        await image.mv(uploadPath);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(uploadPath, {
            resource_type: 'image'
        });

        if (!result.secure_url) {
            return next(new HttpError("Couldn't upload image to Cloudinary", 422));
        }

        // Save post to DB
        const newPost = await PostModel.create({
            creator: req.user.id,
            body,
            image: result.secure_url
        });

        await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { posts: newPost._id }
        });

        res.status(201).json(newPost);

    } catch (error) {
        console.error(error);
        return next(new HttpError(error.message || "Server error", 500));
    }
};


//============================ ***** Get post ***** ====================
// GET : api/post/:id
//PROTECTED
const getPost = async(req, res,next)=>{ 
    try{
        const {id}=req.params;
        const post = await PostModel.findById(id).populate("creator").populate({path:"comments",options:{sort:{createAT:-1}}})
        res.status(200).json(post);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Get posts ***** ====================
// GET : api/posts
//PROTECTED
const getPosts = async(req, res,next)=>{ 
    try{
        const post = await PostModel.find().sort({createdAt:-1})
        res.status(200).json(post);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Update post ***** ====================
// PATCH : api/post/:id
//PROTECTED
const updatePost = async(req, res,next)=>{ 
    try{
        const postid = req.params.id;
        const {body} = req.body;
        //get post from db
        const post = await PostModel.findById(postid);
        //check if creator of the Post is the logged in user
        if(post?.creator != req.user.id){
            return next (new HttpError("Your can't update this post since you are not the creator",403))
        }
        const updatedPost =await PostModel.findByIdAndUpdate(postid,{body},{new:true})
        res.json(updatedPost).status(200);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Delete post ***** ================================
// DELETE : api/post/:id
//PROTECTED
const deletePost = async(req, res,next)=>{ 
    try{
        const postid = req.params.id;
        //get post from db
        const post = await PostModel.findById(postid);
        //check if creator of the Post is the logged in user
        if(post?.creator != req.user.id){
            return next (new HttpError("Your can't delete this post since you are not the creator",403))
        }
        const deletedPost =await PostModel.findByIdAndDelete(postid,{body},{new:true})
        await UserModel.findByIdAndUpdate(post?.creator , {$pull:{posts:post?._id}})
        res.json(deletedPost).status(200);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Get followings post ***** ==========================
// GET : api/post/following
//PROTECTED
const getFollowing = async(req, res,next)=>{ 
    try{
        const user= await UserModel.findById(req.user.id);
        const post = await PostModel.find({creator:{$in:user?.following}})
        res.json(post);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Get like and dislike post ***** ====================
// GET : api/user/:id/like
//PROTECTED
const likeDislikePost = async(req, res,next)=>{ 
    try{
        const {id}= req.params;
        const post = await PostModel.findById(id);
        //check if the logged in user has already liked post
        let updatedPost;
        if(post?.likes.includes(req.user.id)){
            updatedPost = await PostModel.findByIdAndUpdate(id,{$pull:{likes:req.user.id}},{new:true})
        }else{
            updatedPost = await PostModel.findByIdAndUpdate(id,{$push:{likes:req.user.id}},{new:true})
        }

        res.json(updatedPost).status(200);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Get user post ***** ====================
// GET : api/user/:id/posts
//PROTECTED
const getUserPosts = async(req, res,next)=>{ 
    try{
        const userid = req.user.id;
        const posts = await UserModel.findById(userid).populate({path:"post",options:{sort:{createdAt:-1}}})
        res.json(posts).status(200);
    }catch(error){
        return next(new HttpError(error))
    }
};

//============================ ***** Create bookmark ***** ====================
// POST : api/posts/:id/bookmarks
// PROTECTED
const createBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the post is already bookmarked
    if (user.bookmarks.includes(id)) {
      const updatedUser = await UserModel.findByIdAndUpdate(req.user.id,{ $pull: { bookmarks: id } },{ new: true });
      return res.status(200).json({
        message: "Post removed from bookmarks successfully",
        bookmarks: updatedUser.bookmarks,
      });
    }

    // Add post to bookmarks
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id,{ $push: { bookmarks: id } }, { new: true });
    return res.status(200).json({
      message: "Post bookmarked successfully",
      bookmarks: updatedUser.bookmarks,
    });

  } catch (error) {
    next(new HttpError(error.message || "Server Error", 500));
  }
};


//============================ ***** Get bookmark***** ====================
// GET : api/bookmarks
//PROTECTED
const getUserBookmarks = async(req, res,next)=>{ 
    try{
        const userid = req.user.id;
        const user = await UserModel.findById(userid).populate({path:"bookmarks",options:{sort:{createdAt:-1}}})  
        if(!user){
            return next(new HttpError("User not found",422))
        }
        res.json(user.bookmarks).status(200);
    }catch(error){
        return next(new HttpError(error))
    }
};


module.exports ={createPost,getPost,getPosts,updatePost,deletePost,likeDislikePost,getFollowing,getUserPosts,getUserBookmarks,createBookmark};