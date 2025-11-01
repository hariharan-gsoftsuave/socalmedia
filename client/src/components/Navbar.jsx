import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import React from "react";
import "../index.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar overflow-hidden text-white">
      <div>
       <h1 className="text-xl font-bold">MySocial</h1>
          <div className="gap-4">
            <div className="nav_manu">
              <Link to="/">Home</Link>
            </div>
            <div className="nav_manu">
              <Link to="/bookmarks">Bookmarks</Link>
            </div>
            <div className="nav_manu">
              <Link to="/messages">Messages</Link>
            </div>
            <div className="nav_manu">
              <Link to="/users/12ID">Profile</Link>
            </div>
          </div>
      </div>
      <div>
        <button onClick={handleLogout} className="logout_btn">
              Logout
            </button>
      </div>
    </nav>
  );
};

export default Navbar;
