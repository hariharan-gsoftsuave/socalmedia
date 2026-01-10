import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { userActions } from "../store/user-slice";
import uiSlice from "../store/ui-slice";

const UserProfile = () => {
  const token = useSelector(state => state?.user?.currentUser?.token);
  const loggedInUserId = useSelector(state => state?.user?.currentUser?._id);
  const reduxProfilePhoto = useSelector(
    state => state?.user?.currentUser?.profilePhoto
  );

  const [user, setUser] = useState({});
  const [followsUser, setFollowsUser] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarTouched, setAvatarTouched] = useState(false);

  const { id: userId } = useParams();
   const editProfileModalOpen = useSelector((state) => state.ui.editProfileModalOpen);
  const dispatch = useDispatch();

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
      setFollowsUser(
        response.data?.followers?.includes(loggedInUserId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  // Upload avatar
  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        dispatch(
          userActions.changeCurrentUser({
            profilePhoto: response.data.profilePhoto,
          })
        );
        setAvatarTouched(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //function to open edit profile modal
  const openEditProfileModal = () => {
    dispatch(uiSlice.actions.openEditProfileModal());
    // Implementation for opening modal goes here
    };

  // Follow / Unfollow
  const followUnfollowUser = async () => {
    console.log('follow/unfollow clicked', user._id);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/followunfollow/${user._id}`,{},
        {
          withCredentials: true,
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setFollowsUser(prev => !prev);
        getUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="user-profile-section w-100 text-center">
      <div className="profile_container w-100">
        <div className="d-flex justify-content-center">
          {(loggedInUserId == user._id )? (<form
            className="profile_image width_fit_content position-relative"
            onSubmit={changeAvatarHandler}
            encType="multipart/form-data"
          >
            <img
              src={user?.profilePhoto || reduxProfilePhoto }
              alt="Profile"
              className="avatar_image"
            />

            {!avatarTouched ? (
              <label htmlFor="avatar" className="profile_image_edit">
                <LuUpload />
              </label>
            ) : (
              <button type="submit" className="btn btn-primary btn-sm mt-2 profile_image_edit profile_image_save">
                <FaCheck />
              </button>
            )}

            <input
              type="file"
              id="avatar"
              className="d-none"
              accept="image/png, image/jpg, image/jpeg"
              onChange={(e) => {
                setAvatar(e.target.files[0]);
                setAvatarTouched(true);
              }}
            />
          </form>):(
             <img
              src={user?.profilePhoto || reduxProfilePhoto }
              alt="Profile"
              className="avatar_image"
            />
          )}
        </div>
        <h4>{user?.fullName}</h4>
        <small>{user?.email}</small>

        <ul className="d-flex gap-4 justify-content-center profile_follows" style={{ listStyleType: "none", padding: 0 }}>
          <li><h4>{user?.following?.length || 0}</h4><small>Following</small></li>
          <li><h4>{user?.followers?.length || 0}</h4><small>Followers</small></li>
          <li><h4>{user?.likes?.length || 0}</h4><small>Likes</small></li>
        </ul>

        <div>
          {userId === loggedInUserId ? (
            <button className="btn btn-outline-primary" onClick={openEditProfileModal}>Edit Profile</button>
          ) : (
            <button className="btn btn-secondary" onClick={followUnfollowUser}>
              {followsUser ? "Unfollow" : "Follow"}
            </button>
          )}

          {userId !== loggedInUserId && (
            <Link className="btn btn-outline-primary ms-2" to={`/messages/${userId}`}>
              Message
            </Link>
          )}
        </div>

        <article className="profile_Bio">
          <p>{user?.bio || "No bio available."}</p>
        </article>
      </div>
      {editProfileModalOpen && (
        <div className="modal_overlay" onClick={() => dispatch(uiSlice.actions.closeEditProfileModal())}>
          <div className="modal_content w-50 p-4">
            {/* Modal content for editing profile goes here */}
            <div className="d-flex justify-content-center">
              <form
                className="profile_image width_fit_content position-relative"
                onSubmit={changeAvatarHandler}
                encType="multipart/form-data"
              >
                <img
                  src={user?.profilePhoto || reduxProfilePhoto }
                  alt="Profile"
                  className="avatar_image"
                />

                {!avatarTouched ? (
                  <label htmlFor="avatar" className="profile_image_edit">
                    <LuUpload />
                  </label>
                ) : (
                  <button type="submit" className="btn btn-primary btn-sm mt-2 profile_image_edit profile_image_save">
                    <FaCheck />
                  </button>
                )}

                <input
                  type="file"
                  id="avatar"
                  className="d-none"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => {
                    setAvatar(e.target.files[0]);
                    setAvatarTouched(true);
                  }}
                />
              </form>
            </div>
            
            <button onClick={() => dispatch(uiSlice.actions.closeEditProfileModal())}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
