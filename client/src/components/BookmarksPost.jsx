import React, { useState, useEffect } from "react";
import "../index.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const BookmarksPost = ({ post }) => {
  const [isBookmarked, setIsBookmarked] = useState(post);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) =>
    state?.user?.currentUser?._id
  );

  // Load bookmark status ONCE
  const fetchBookmarkStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = response.data;

      // Check if user bookmarked this post
      setIsBookmarked(user?.bookmarks?.includes(post?._id));
    } catch (error) {
      console.error("Error fetching bookmark status:", error);
    }
  };

  useEffect(() => {
    fetchBookmarkStatus();
  }, []);
  useEffect(() => {
  setIsBookmarked(post);
}, [post]);


  // Toggle bookmark using Route C
  const toggleBookmark = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
        {}, // Empty body
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <button className="feed_footer-bookmark" onClick={toggleBookmark}>
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarksPost;
