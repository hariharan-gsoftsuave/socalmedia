import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../index.css";

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Example validation (you can enhance this)
    if (userData.password !== userData.confirmpassword) {
      setError("Passwords do not match");
      return;
    }
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);
      response.status === 201 && navigate("/login");

    }catch (err){

      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="register">
      <div className="align-items-center container flex-column justify-content-center register-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 m-5">
          {error && <p className="form__error-message bg-danger form__error-message m-0 p-2 rounded-3 text-bg-danger text-center">{error}</p>}

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={changeInputHandler}
          />

          <div className="password__controller">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={changeInputHandler}
            />
            <span className="password__icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password__controller">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmpassword"
              placeholder="Confirm Password"
              onChange={changeInputHandler}
            />
           <span className="password__icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p className="register__redirect">
            Already have an account?{" "}
            <span className="" onClick={() => navigate("/login")}>Log In</span>
          </p>

          <button type="submit" className="btn_primary bg-info">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
