const { text } = require('express');
const mongoose = require('mongoose');
const {Schema, model} =require("mongoose");

const conversationSchema = new Schema({
    participants:[{type:Schema.Types.ObjectId, ref:"User"}],
    lastMessage:{
        text:{type:String,required:true, trim:true},
        senderId:{type:Schema.Types.ObjectId, ref:"User"},
    },
},{timestamps:true});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;