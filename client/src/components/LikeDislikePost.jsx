import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import "../index.css";

const LikeDislikePost = ({ post }) => {
    console.log("LikeDislikePost received post:", post);
  const [currentPost, setCurrentPost] = useState(post); 
  const [postLiked, setPostLiked] = useState(false);

  const userId = useSelector((state) => state?.user?.currentUser?._id);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${currentPost._id}/like`,
        {}, // Empty body
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCurrentPost(response.data);
      }
    } catch (error) {
      console.log("Error liking/disliking post:", error);
    }
  };

  const checkIfUserLikedPost = () => {
    setPostLiked(currentPost?.likes?.includes(userId));
  };

  useEffect(() => {
    checkIfUserLikedPost();
  }, [currentPost]);

  return (
    <button className="like-dislike-btn" onClick={handleLikeDislikePost}>
      {postLiked ? <FcLike /> : <FaRegHeart />}
      <span>{currentPost?.likes?.length || 0}</span>
    </button>
  );
};

export default LikeDislikePost;
