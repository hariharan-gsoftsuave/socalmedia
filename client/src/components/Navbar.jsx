import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { GoMail } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import "../index.css";
import ProfileImage from "./ProfileImage"; // Ensure file name matches exactly (case-sensitive)
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?._id);
  const profileImageUrl = useSelector((state) => state?.user?.currentUser?.profilePhoto);
  const username = useSelector((state) => state?.user?.currentUser?.fullName);

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
    <nav className="flex items-center justify-content-md-evenly navbar overflow-hidden px-4 text-white">
        <div className="flex flex-col items-center headerprofile">
            <div className="flex items-center gap-2">
            <Link to={`/users/${userId}`} className="d-flex gap-2">
              <div>
                <ProfileImage src={profileImageUrl}alt="Profile" size="30px"/>
              </div>
               <p className="small m-0">{username}</p>
            </Link>
          </div>
        </div>
        <div className="gap-4 items-center mt-2 headermenu">
          <div className="d-flex gap-2 mb-1 items-center justify-content-around">
            <h5 className="text-xl font-bold">MySocial</h5>
            <form className="navbar_search">
              <input
                type="text"
                placeholder="Search..."
                className="navbar_search_input"
              />
            </form>
          </div>
        </div>
        <div className="headerlogoutBtn">
        {userId ? (
          <button
            onClick={() => navigate("/logout")}
            className="logout_btn bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="login_btn bg-blue-500 px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
