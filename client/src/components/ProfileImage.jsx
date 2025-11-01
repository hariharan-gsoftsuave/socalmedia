import React from "react";

const ProfileImage = ({ src, size, alt }) => {
  const sizeMap = {
    small: "32px",
    medium: "64px",
    large: "128px",
  };

  const imageStyle = {
    width: sizeMap[size] || sizeMap.small,
    height: sizeMap[size] || sizeMap.small,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e1e1e1",
  };

  return (
    <img
      src={src || "/default-profile.png"} // Replace with your actual default image path
      alt={alt || "Profile picture"}
      style={imageStyle}
    />
  );
};

export default ProfileImage;
