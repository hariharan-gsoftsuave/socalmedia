import { useNavigate } from "react-router-dom";
import React from "react";
import "../index.css";
import { useEffect } from "react";
import { userActions } from "../store/user-slice";
import { useDispatch } from "react-redux";


const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = {};

  useEffect(() => {
    dispatch(userActions.changeCurrentUser(user));
    localStorage.removeItem("currentUser");
    navigate("/login");
  }, []);

  return (
    <div className="container text-center mt-5">
      Logging out..
    </div>
  )
   
  };
export default Logout;
