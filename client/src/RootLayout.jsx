import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Widgets from "./components/Widgets";
import ThemeModal from "./components/ThemeModal";

const RootLayout = () => {
  const themeModalIsOpen = useSelector((state) => state.ui.themeModalIsOpen);

  return (
    <>
      <Navbar />
      <main className="main">
        <div className="container main_container">
          <Sidebar />
           {themeModalIsOpen && <ThemeModal />}
          <Outlet />
          <Widgets />
        </div>
      </main>
    </>
  );
};

export default RootLayout;
