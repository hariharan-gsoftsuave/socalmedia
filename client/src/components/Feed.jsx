import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ProfileImage from "./ProfileImage";
import TimeAgo from "timeago-react";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import LikeDislikePost from "./LikeDislikePost";
import TrimText from "../helpers/TrimText";
import BookmarksPost from "./BookmarksPost";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Feed = ({ post , onSetPosts}) => {
  const [creator, setCreator] = useState(null);
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?._id);

  const toggleHeaderMenu = () => {
    setShowFeedHeaderMenu((prev) => !prev);
  };

  const openSinglePost = (id) => {
    navigate(`/post/${id}`);
  };

  const deletePost = async () => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/posts/${post?._id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Post deleted successfully:", response.data);
      onSetPosts((X) =>
        X.filter((p) => p._id !== post._id)
      );
    }
  } catch (error) {
    console.error(
      "Error deleting post:",
      error.response?.data || error.message
    );
  }
};


  const getPostCreator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${post.creator}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCreator(response?.data);
    } catch (error) {
      console.error("Error fetching post creator:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (post?.creator) getPostCreator();
  }, [post?.creator]);

  return (
    <div className="post-container my-2" id={post?._id}>
      
      {/* Header */}
      <header className="post-header d-flex justify-content-between align-center">
        <Link
          to={`/users/${post?.creator}`}
          className="post-creator-link d-flex align-center gap-2"
        >
          <ProfileImage
            src={creator?.profilePhoto}
            alt="Profile"
            size="30px"
          />

          <div className="feed_header_details d-flex flex-column">
            <h4 className="m-0">{creator?.fullName || "Unknown User"}</h4>
            <small>
              {post?.updatedAt ? <TimeAgo datetime={post.updatedAt} /> : "Just now"}
            </small>
          </div>
        </Link>

        {/* Edit/Delete Menu */}
        {userId === post?.creator && location.pathname.includes("users") && (
          <div className="post-menu-wrapper position-relative">
            <button onClick={()=>toggleHeaderMenu()}>⋮</button>
            {showFeedHeaderMenu && (
              <menu className="post-menu edDeBtn">
                <button onClick={() => setShowFeedHeaderMenu(false)}>Edit</button>
                <button onClick={() => deletePost()}>Delete</button>
              </menu>
            )}
          </div>
        )}
      </header>

      {/* Body */}
      <div className="post-body">
        {post?.image && (
          <div
            className="post-image"
            onClick={() => openSinglePost(post?._id)}
            style={{ cursor: "pointer" }}
          >
            <img src={post?.image} alt="Post" />
          </div>
        )}

        <p className="m-0">
          <TrimText text={post?.body || ""} maxLength={100} />
        </p>
      </div>

      {/* Footer */}
      <footer className="feed_footer d-flex align-center gap-3">
        
        {/* Like */}
        <LikeDislikePost post={post} />

        {/* Comments */}
        <button className="feed_footer-share">
        <FaRegCommentDots />
          <small>{post?.comments?.length || 0}</small>
        </button>

        {/* Share */}
        <button className="feed_footer-share">
          <IoMdShare />
        </button>

        {/* Bookmark */}
        <BookmarksPost post={post} />
      </footer>
    </div>
  );
};

export default Feed;
