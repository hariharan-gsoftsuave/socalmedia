import React from "react";  
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import RootLayout from "./RootLayout";
import ErrorPage from "./pages/Errorpage";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import SinglePost from "./pages/singlePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import MessagesList from "./components/MessagesList";

const router = createBrowserRouter([
  {
    path: "/", 
    element: <RootLayout />, 
    errorElement: <ErrorPage />, 
    children: [
      { index: true, element: <Home /> }, 
      { path: "messages", element: <MessagesList /> },
      { path: "messages/:receiverId", element: <Messages /> },
      { path: "bookmarks", element: <Bookmarks /> },
      { path: "users/:id", element: <Profile /> },
      { path: "post/:id", element: <SinglePost /> },
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/logout", element: <Logout /> },
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
