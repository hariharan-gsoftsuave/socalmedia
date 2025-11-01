import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { GoMail } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";
import { PiPaintBrushBold } from "react-icons/pi"; // ✅ corrected icon name
import { useDispatch } from "react-redux";

import { uiSliceActions } from "../store/ui-slice";
import "../index.css";

const Sidebar = () => {
  const dispatch = useDispatch();

  const openThemeModal = (e) => {
    e.preventDefault();
    dispatch(uiSliceActions.openThemeModal());
  };

  return (
    <menu className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `sidebar_item d-flex gap-2 ${isActive ? "active" : ""}`
        }
      >
        <i className="sidebar_icon">
          <AiOutlineHome />
        </i>
        <p>Home</p>
      </NavLink>

      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `sidebar_item d-flex gap-2 ${isActive ? "active" : ""}`
        }
      >
        <i className="sidebar_icon">
          <GoMail />
        </i>
        <p>Messages</p>
      </NavLink>

      <NavLink
        to="/bookmarks"
        className={({ isActive }) =>
          `sidebar_item d-flex gap-2 ${isActive ? "active" : ""}`
        }
      >
        <i className="sidebar_icon">
          <FaBookmark />
        </i>
        <p>Bookmarks</p>
      </NavLink>

      <a href="#" className="sidebar_item d-flex gap-2" onClick={openThemeModal}>
        <i className="sidebar_icon">
          <PiPaintBrushBold />
        </i>
        <p>Themes</p>
      </a>
    </menu>
  );
};

export default Sidebar;
