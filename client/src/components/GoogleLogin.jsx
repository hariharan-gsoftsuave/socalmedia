import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../store/user-slice";
import { login } from "../utils/auth";
import React from "react";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const details = jwtDecode(token);

      const userData = {
        name: details.name,
        email: details.email,
        googleId: details.sub,
      };
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/google-login`,
        userData
      );
      const user = res.data;
      login(user.token);

      localStorage.setItem("currentUser", JSON.stringify(user));
      dispatch(userActions.changeCurrentUser(user));
      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => console.log("Google Login Failed")}
    />
  );
};

export default GoogleLoginButton;
