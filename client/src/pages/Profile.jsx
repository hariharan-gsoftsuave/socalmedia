import UserProfile from "../components/UserProfile";
import HaterInfo from "../components/HaterInfo";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import { uiSliceActions } from "../store/ui-slice";
import Feeds from "../components/Feeds";

const Profile = () => {
    const {id: userId} = useParams();
    const token = useSelector(state => state?.user?.currentUser?.token);

    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [showFeedview, setShowFeedview] = useState(false);
    const dispatch = useDispatch();

    const setloading = (state) => {
      dispatch(uiSliceActions.setLoading(state));
    };
    //const loggedInUserId = useSelector(state => state?.user?.currentUser?._id);
    // Fetch profile
    const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUserPosts(userPosts);
  }, [userPosts]);

//Get user's posts 
  const getUserPosts = async () => {
    setloading(true);
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/posts/${userId}`,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
            // Handle the user's posts as needed
        setUserPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getUser();
    getUserPosts();
  }, [userId]);
    return (
 <section className="align-items-center d-flex flex-column justify-content-center w-100">
  <UserProfile/>
  <HaterInfo text={`${user?.fullName}'s Posts`}/>
{ userPosts.length > 0 ? (
  <div className="row mt-3 mb-5">
  {showFeedview ?
    <Feeds posts={userPosts} onSetPosts={setUserPosts} /> :
      userPosts?.map(post => (
        <div key={post._id} className="col-md-4 mb-1" style={{padding:2}}>
          <img
          src={post.image}
          alt="Post"
          className="img-fluid rounded h-100 w-100"
           onClick={() => setShowFeedview(true)}
        />
      </div>
    ))}
  </div>
) : (
  <div className="no_posts_info text-center mt-5">
    <p>{user?.fullName} has not posted anything yet.</p>
  </div>
)}
 </section>
    )
};

export default Profile;
