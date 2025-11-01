const mongoose = require('mongoose');
const {Schema, model} =require("mongoose");

const userSchema =new Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profilePhoto:{type:String,default:"https://res.cloudinary.com/dlsmzi3vd/image/upload/cld-sample"},
    bio:{type:String,dafault:"no bio yet"},
    followers:[{type:Schema.Types.ObjectId,ref:"User"}],
    following:[{type:Schema.Types.ObjectId,ref:"User"}],
    bookmarks:[{type:Schema.Types.ObjectId,ref:"Post"}],
    post:[{type:Schema.Types.ObjectId,ref:"Post"}]
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;