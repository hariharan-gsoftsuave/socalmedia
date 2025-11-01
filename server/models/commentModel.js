const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    creator: {
      creator_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      creator_name: {
        type: String,
        required: true,
      },
      creator_avatar: {
        type: String,
        required: true,
      },
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },{timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
