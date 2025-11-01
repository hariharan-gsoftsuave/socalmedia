const mongoose = require('mongoose');
const {Schema, model} =require("mongoose");

const MessageSchema = new Schema({
    conversationId:{type:Schema.Types.ObjectId, ref:"Conversation", required:true},
    sender:{type:Schema.Types.ObjectId, ref:"User",required:true},
    text:{type:String, required:true, trim:true},
},{timestamps:true});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;