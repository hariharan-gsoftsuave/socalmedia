import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
import axios from "axios";
import { useSelector } from "react-redux";
import TimeAgo from "timeago-react";
import TrimText from "../helpers/TrimText";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare, IoMdSend } from "react-icons/io";
import LikeDislikePost from "../components/LikeDislikePost";
import BookmarksPost from "../components/BookmarksPost";
import PostComment from "../components/PostComment";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COMMENTS_PER_PAGE = 5;

const SinglePost = () => {
  const { id } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setPosting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${id}`,
        { comment: newComment },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPost(res.data);
        setComments(res.data.comments || []);
      } catch {
        toast.error("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id, token]);

  const handleScroll = () => {
    const commentList = document.querySelector(".comment-list");
    if (commentList) {
      const { scrollTop, scrollHeight, clientHeight } = commentList;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setVisibleCount((prev) =>
          Math.min(prev + COMMENTS_PER_PAGE, comments.length)
        );
      }
    }
  };

  useEffect(() => {
    const commentList = document.querySelector(".comment-list");
    commentList?.addEventListener("scroll", handleScroll);
    return () => commentList?.removeEventListener("scroll", handleScroll);
  }, [comments.length]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <section className="single-post w-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="single-post-header d-flex align-center gap-2">
        <ProfileImage
          src={post?.creator?.profilePhoto}
          alt="Profile"
          size="40px"
        />

        <div className="d-flex justify-content-between w-100">
          <h4>{post?.creator?.fullName || "Unknown User"}</h4>
          <small>
            <TimeAgo datetime={post?.updatedAt} />
          </small>
        </div>
      </header>

      {/* Body */}
      <div className="single-post-body">
        <p>
          <TrimText text={post?.body || ""} maxLength={200} />
        </p>

        {post?.image && (
          <div className="single-post-image">
            <img src={post.image} alt="Post" className="rounded-3 w-100" />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="feed_footer d-flex align-center gap-3">
        <LikeDislikePost post={post} />
        <button className="feed_footer-share">
          <FaRegCommentDots />
          <small>{comments.length}</small>
        </button>

        <button className="feed_footer-share">
          <IoMdShare />
        </button>

        <BookmarksPost post={post} />
      </footer>

      {/* Create Comment */}
      <form className="create-post-form" onSubmit={createComment}>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button type="submit" disabled={posting || !newComment.trim()}>
          {posting ? "Sending..." : <IoMdSend />}
        </button>
      </form>

      {/* Comments */}
      <ul className="comment-list" style={{ maxHeight: "400px", overflowY: "auto" , scrollbarWidth: "none"}}>
        {comments.slice(0, visibleCount).map((comment) => (
          <PostComment
            key={comment._id}
            comment={comment}
            onDeleteComment={() => deleteComment(comment._id)}
          />
        ))}
      </ul>
    </section>
  );
};

export default SinglePost;