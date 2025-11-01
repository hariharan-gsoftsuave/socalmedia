import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async(e) => {
    e.preventDefault();
     if (!form.email || !form.password) {
          setError("Fill in all fields");
          return;
        }
        try{
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, form);
          if(response.status === 200){
            const user = response.data; 
            const token = user.token; 

            // Store token
            login(token);

            // Store user in localStorage
            localStorage.setItem("currentUser", JSON.stringify(user));

            // Update Redux
            dispatch(userActions.changeCurrentUser(user));
            navigate("/");
          }
        }catch (err){
          setError(err?.response?.data?.message || "login failed");
        }
  };

  return (
    <div className="container w-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 m-5">
        {error && <p className="form__error-message bg-danger form__error-message m-0 p-2 rounded-3 text-bg-danger text-center">{error}</p>}
        <input type="email" placeholder="Email" className="border p-2 rounded" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 rounded" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
      <p className="text-center mt-3">
        Don’t have an account? <Link to="/register" className="text-blue-500">Register</Link>
      </p>
    </div>
  );
};

export default Login;
