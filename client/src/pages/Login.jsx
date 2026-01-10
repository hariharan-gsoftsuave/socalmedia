import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginimage from "../assets/landing-2x.png"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Fill in all fields");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, form);
      if (response.status === 200) {
        const user = response.data;
        const token = user.token;
console.log("login user:", user);
        // Store token
        login(token);

        // Store user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Update Redux
        navigate("/");
        dispatch(userActions.changeCurrentUser(user));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "login failed");
    }
  };

  return (
    <div className="container w-auto">
      <div>
          <img src={loginimage}></img>
        </div>
        <div className="d-flex flex-column">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 m-5">
            {error && <p className="form__error-message bg-danger form__error-message m-0 p-2 rounded-3 text-bg-danger text-center">{error}</p>}
            <input type="email" placeholder="Email" className="border p-2 rounded" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="password__controller">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="border p-2 rounded"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span className="password__icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 rounded bg-info">Login</button>
          </form>
          <p className="text-center mt-3">
            Don’t have an account? <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </div>
    </div>
  );
};

export default Login;
