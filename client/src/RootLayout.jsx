import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Widgets from "./components/Widgets";
import ThemeModal from "./components/ThemeModal";

const RootLayout = () => {
  const themeModalIsOpen = useSelector((state) => state.ui.themeModalIsOpen);
  const loading = useSelector((state) => state.ui.loading);

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="main">
        {loading && (
            <div className="text-center overlay">Loading...</div>
          )}
        <div className="container main_container">
          {themeModalIsOpen && <ThemeModal />}
          <Outlet />
        </div>
      </main>
      <Widgets />
    </>
  );
};

export default RootLayout;
