import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import "../index.css";
import ProfileImage from "./ProfileImage"; // Ensure file name matches exactly (case-sensitive)
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?._id);
  const profileImageUrl = useSelector((state) => state?.user?.currentUser?.profilePhoto);
  const username = useSelector((state) => state?.user?.currentUser?.fullName);

  console.log("Navbar - Current User ID:", userId, profileImageUrl);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Auto logout after 1 hour
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/logout");
    }, 1000 * 60 * 60); // 1 hour

    return () => clearTimeout(timer); // cleanup to prevent memory leak
  }, [navigate]);

  return (
    <nav className="navbar overflow-hidden text-white flex justify-between items-center px-4">
      <div>
        <h1 className="text-xl font-bold">MySocial</h1>

        <div className="flex gap-4 items-center mt-2">
          <div className="nav_menu flex items-center gap-2">
            <form className="navbar_search">
              <input
                type="text"
                placeholder="Search..."
                className="navbar_search_input"
              />
            </form>
            <Link to="/">Home</Link>
          </div>

          <div className="nav_menu">
            <Link to="/bookmarks">Bookmarks</Link>
          </div>

          <div className="nav_menu">
            <Link to="/messages">Messages</Link>
          </div>

          <div className="nav_menu flex items-center gap-2">
            <Link to={`/users/${userId}`} className="d-flex gap-2">
            <div>
              <ProfileImage
              src={profileImageUrl}
              alt="Profile"
              size="30px"
            />
            </div>Profile</Link>
            <p className="small m-0">{username}</p>
            
          </div>
        </div>
      </div>

      <div>
        {userId ? (
          <button
            onClick={() => navigate("/logout")}
            className="logout_btn text-white bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="login_btn text-white bg-blue-500 px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
