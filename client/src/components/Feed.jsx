import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import TimeAgo from "timeago-react";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import LikeDislikePost from "./LikeDislikePost";
import TrimText from "../helpers/TrimText";
import BookmarksPost from "./BookmarksPost";

const Feed = ({ post }) => {
  const [creator, setCreator] = useState(null);

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?._id);
  const location = window.location;
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);

  const toggleHeaderMenu = () => setShowFeedHeaderMenu(!showFeedHeaderMenu);

  const deletePost = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Post deleted successfully:", response.data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
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

      setCreator(response.data);
    } catch (error) {
      console.error("Error fetching post creator:", error);
    }
  };

  useEffect(() => {
    if (post?.creator) getPostCreator();
  }, [post?.creator]);

  return (
    <div className="post-container my-2">
      
      {/* Post Body */}
      <div className="post-body">
        {post?.image && (
          <div className="post-image">
            <img src={post?.image} alt="Post" />
          </div>
        )}

        <p className="m-0">
          <TrimText text={post?.body} maxLength={100} />
        </p>
      </div>

      {/* Header */}
      <header className="post-header">
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
            <h4 className="m-0">{creator?.fullName}</h4>

            {/* Correct TimeAgo */}
            <small>
              {post?.updatedAt ? (
                <TimeAgo datetime={post.updatedAt} />
              ) : (
                "Just now"
              )}
            </small>
          </div>
        </Link>

        {/* Edit/Delete Menu */}
        {userId === post?.creator && location.pathname.includes("users") && (
          <>
            <button onClick={toggleHeaderMenu}>⋮</button>
            {showFeedHeaderMenu && (
              <menu>
                <button onClick={toggleHeaderMenu}>Edit</button>
                <button onClick={deletePost}>Delete</button>
              </menu>
            )}
          </>
        )}
      </header>

      {/* Footer */}
      <footer className="feed_footer d-flex align-center gap-3">
        
        {/* Like Component */}
        <LikeDislikePost post={post} />

        {/* Comments */}
        <button className="feed_footer-comments">
          <Link to={`/posts/${post?._id}`}>
            <FaRegCommentDots />
          </Link>
          <small>{post?.comments?.length || 0}</small>
        </button>

        {/* Share */}
        <button className="feed_footer-share">
          <IoMdShare />
        </button>
        <BookmarksPost post={post}/>
      </footer>
    </div>
  );
};

export default Feed;
