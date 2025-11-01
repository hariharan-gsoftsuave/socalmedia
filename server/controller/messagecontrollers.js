const HttpError = require('../models/errorModel');
const ConversationModel = require("../models/conversationModel");
const MessageModel = require("../models/messageModel");
const UserModel = require('../models/userModel');

// ============================ ***** Create Message ***** ====================
// POST : /api/messages
// PROTECTED
const createMessage = async (req, res, next) => {
  try {
    const {recipientId, message } = req.body;
    let conversation = await ConversationModel.findOne({
      members: { $all: [req.user.id, recipientId] },
    });
    if (!conversation) {
      conversation =await ConversationModel.create({
      participants : [req.user.id, recipientId],
      lastMessage : {text: message, senderId: req.user.id},
      });
    }
    //create message
    const newMessage = await MessageModel.create({
      conversationId: conversation._id,
      sender: req.user.id,
      text: message,
    });
    //update last message in conversation
    await conversation.updateOne({
      lastMessage: { text: message, senderId: req.user.id },
    });
    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    }); 

  } catch (error) {
    return next(new HttpError(error.message || "Error creating message", 500));
  }
};

// ============================ ***** Get Messages of a Conversation ***** ====================
// GET : /api/messages/:conversationId
// PROTECTED
const getMessagesOfConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.params;
    const conversation = await ConversationModel.findOne({
      participants: { $all: [req.user.id, recipientId] },
    });
    if (!conversation) {
      return next(new HttpError("No conversation found", 404));
    }
    const messages = await MessageModel.find({ conversationId: conversation })
      .sort({ createdAt: 1 })
      .populate("sender", "username profilePicture");
    return res.status(200).json({
      conversation,
    }); 
  }
    catch (error) { 
    return next(new HttpError(error.message || "Error fetching messages", 500));
    }
};

module.exports = {
  createMessage,
  getMessagesOfConversation,
};  