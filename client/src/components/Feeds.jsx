import React from "react";
import Feed from "./Feed";



const Feeds = ({ posts, onSetPosts }) => {
  return (
    <div className="posts-container">   
        {posts?.length <0? <p className="center">No posts found.</p> : posts?.map((post) => (
            <Feed key={post._id} post={post} onSetPosts={onSetPosts} />
        ))}
    </div>
    );
};
export default Feeds;
