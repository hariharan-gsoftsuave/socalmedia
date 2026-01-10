import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import "../index.css";
import Feeds from "../components/Feeds";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useSelector((state) => state?.user?.currentUser?.token);

  const createdPost = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status !== 201) {
        throw new Error("Failed to create post.");
      }else {
        setError("");
      }
      console.log("Post created successfully:", response.data);
     const newPost = response.data;
      setPosts([newPost, ...posts]);
      
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post.");
    } finally {
      setIsLoading(false);
    }
  };

  // function to fetch posts
    useEffect(() => {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/posts`,
            { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
          );
          setPosts(response.data);
        } catch (err) {
          console.error("Error fetching posts:", err);
        } finally {
          setIsLoading(false);
        }
      };
  
      // fetch posts when token (or other dependencies) change
      fetchPosts();
    }, [token, setPosts]);

  return (
    <section className="mainHome-container w-100">
      <CreatePost 
        onCreatePost={createdPost}  // ✅ corrected prop name
        error={error}
        isLoading={isLoading}
      />
      <Feeds posts={posts} onSetPosts={setPosts} />
      
    </section>
  );
};

export default Home;
