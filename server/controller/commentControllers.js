const HttpError = require('../models/errorModel');
const CommentModel = require("../models/commentModel");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");


// ============================ ***** Create Comment ***** ====================
// POST : /api/comments/:id
// PROTECTED
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return next(new HttpError("Comment text is required", 400));
    }
    //get comment creator deatails from logged in user
    // Validate user
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    // Validate post
    const post = await PostModel.findById(id);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }
    // Create new comment
    const newComment = new CommentModel({
      creator: {
        creator_id: user._id,
        creator_name: user.fullName,
        creator_avatar: user.profilePhoto,
      },
      postId: post._id,
      comment,
    });

    await newComment.save();

    // Add comment reference to the post
    post.comments.push(newComment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Error creating comment", 500));
  }
};

// ============================ ***** Get Comments of a Post ***** ====================
// GET : /api/comments/:id
// PROTECTED
const getCommentsOfPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id)
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      strictPopulate: false,
    });

    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    return res.status(200).json({
      message: "Comment fetched successfully",
      comment: post.comments,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Error fetching comment", 500));
  }
};

// ============================ ***** Delete Comment ***** ====================
// DELETE : /api/comments/:id
// PROTECTED
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await CommentModel.findById(id);
    if (!comment) {
      return next(new HttpError("Comment not found", 404));
    }

    // Check ownership
    if (comment.creator.creator_id.toString() !== req.user.id) {
      return next(
        new HttpError("You are not authorized to delete this comment", 403)
      );
    }

    // Remove comment and update post
    await CommentModel.findByIdAndDelete(id);
    await PostModel.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id },
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return next(new HttpError(error.message || "Error deleting comment", 500));
  }
};

module.exports = {
  createComment,
  getCommentsOfPost,
  deleteComment,
};
