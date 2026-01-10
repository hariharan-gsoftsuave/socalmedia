import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import { SlPicture } from "react-icons/sl";

const CreatePost = ({ onCreatePost, error }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const profilePhoto = useSelector(
    state => state?.user?.currentUser?.profilePhoto
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const createPost = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("body", body);
    if (image) formData.append("image", image);

    onCreatePost(formData);

    setBody("");
    setImage(null);
    setPreview(null);
  };

  return (
    <form className="create-post-form" onSubmit={createPost}>
      {error && <p className="bg-danger text-white">{error}</p>}

      {preview && (
        <img src={preview} alt="Preview" className="preview-img" />
      )}

      <div className="creatPost_top">
        <ProfileImage src={profilePhoto} size="30px" />
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="What's on your mind?"
        />
      </div>

      <div className="creatPost_bottom d-flex gap-3 justify-content-end align-items-center">
        <label htmlFor="fileInput">
          <SlPicture size={22} />
        </label>
        <input
          type="file"
          id="fileInput"
          hidden
          onChange={handleImageChange}
        />
        <button type="submit">Post</button>
      </div>
    </form>
  );
};

export default CreatePost;
