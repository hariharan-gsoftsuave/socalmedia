import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import store from "../store/store";
import React from "react";
import "../index.css";
import { useDispatch } from "react-redux";
import { uiSliceActions } from "../store/ui-slice";


const user = store.getState().user.currentUser;
console.log("Current User in Home:", user);
const Home = () => {
   const dispatch = useDispatch();
   dispatch(uiSliceActions.closeThemeModal());
  const posts = [
    { id: 1, title: "My first post", content: "Hello world!" },
    { id: 2, title: "Another post", content: "React is awesome!" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Home Feed</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`}>
            <PostCard post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Home;
