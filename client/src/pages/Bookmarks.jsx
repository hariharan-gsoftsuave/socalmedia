import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Feed from "../components/Feed";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state?.user?.currentUser?.token);

  const getBookmarks = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/bookmarks`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookmarks(response?.data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  return (
    <section>
      {isLoading && <p className="center">Loading...</p>}

      {!isLoading && bookmarks.length < 1 ? (
        <p className="center">No bookmarks found</p>
      ) : (
        bookmarks.map((bookmark) => (
          <Feed key={bookmark._id} post={bookmark} />
        ))
      )}
    </section>
  );
};

export default Bookmarks;
