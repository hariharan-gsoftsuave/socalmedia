import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { GoMail } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";
import { PiPaintBrushBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { uiSliceActions } from "../store/ui-slice";
import "../index.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // ✅ Close theme modal on route change
  React.useEffect(() => {
    dispatch(uiSliceActions.closeThemeModal());
  }, [location.pathname, dispatch]);

  return (
    <menu className="sidebar rounded-3 gap-3 d-flex flex-column p-3">

      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `sidebar_item d-flex gap-2 ${isActive ? "active" : ""} nav_manu`
        }
      >
        <i className="sidebar_icon"><AiOutlineHome /></i>
        Home
      </NavLink>

      {/* Messages */}
      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `sidebar_item d-flex gap-2 ${isActive ? "active" : ""}  nav_manu`
        }
      >
        <i className="sidebar_icon"><GoMail /></i>
        Messages
      </NavLink>

      {/* Bookmarks */}
      <NavLink
        to="/bookmarks"
        className={({ isActive }) =>
          `sidebar_item d-flex gap-2 ${isActive ? "active" : ""}  nav_manu`
        }
      >
        <i className="sidebar_icon"><FaBookmark /></i>
        Bookmarks
      </NavLink>

      {/* Theme */}
      <a
        href="#"
        className="sidebar_item d-flex gap-2  nav_manu"
        onClick={() => {
          dispatch(uiSliceActions.closeAllModals?.()); // optional if added
          dispatch(uiSliceActions.openThemeModal());
        }}
      >
        <i className="sidebar_icon"><PiPaintBrushBold /></i>
        Themes
      </a>

    </menu>
  );
};

export default Sidebar;
