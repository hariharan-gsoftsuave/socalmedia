import React, { useState } from "react";
import ProfileImage from "./ProfileImage";
import { useSelector } from "react-redux";
import { SlPicture } from "react-icons/sl";

const CreatePost = ({ onCreatePost, error }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // ⭐ for preview

  const profileImageUrl = useSelector(
    (state) => state?.user?.currentUser?.profilePhoto
  );

  // Handle image select → show preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // ⭐ preview url
  };

  // Create Post Function
  const createPost = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("body", body);
    if (image) formData.append("image", image);

    onCreatePost(formData);

    // Reset after submit
    setBody("");
    setImage(null);
    setPreview(null);
  };

  return (
    <form
      className="create-post-form"
      encType="multipart/form-data"
      onSubmit={createPost}
    >
      {error && <p className="bg-danger m-0 p-1 rounded-3 text-white">{error}</p>}
{/* ⭐ Image Preview Section */}
      {preview && (
        <div className="image-preview-container" style={{ marginTop: "10px" }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setPreview(null);
            }}
            style={{
              marginTop: "5px",
              background: "red",
              color: "white",
              padding: "3px 8px",
              borderRadius: "5px",
              border: "none",
            }}
          >
            Remove Image
          </button>
        </div>
      )}
      <div className="creatPost_top">
        <ProfileImage src={profileImageUrl} alt="Profile" size="30px" />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
        />
      </div>

      <div className="creatPost_bottom">
        <span></span>
        <div className="creatPost_actions">
          <label htmlFor="fileInput" className="file-label">
            <SlPicture size={22} />
          </label>

          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageChange} // ⭐ updated
          />

          <button className="p-1" type="submit">Post</button>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
