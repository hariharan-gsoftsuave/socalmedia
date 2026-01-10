import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileImage from "./ProfileImage";
import { userActions } from "../store/user-slice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector(state => state?.user?.currentUser?.token);
  const userId = useSelector(state => state?.user?.currentUser?._id);
  const username = useSelector(state => state?.user?.currentUser?.fullName);
  const profilePhoto = useSelector(
    state => state?.user?.currentUser?.profilePhoto
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const logoutHandler = () => {
    dispatch(userActions.logout());
    navigate("/login");
  };

  return (
    <nav className="navbar d-flex align-items-center justify-content-between px-4">
      {/* LEFT – Profile */}
      <Link
        to={`/users/${userId}`}
        className="d-flex align-items-center gap-2 text-decoration-none"
      >
        <ProfileImage src={profilePhoto} size="30px" />
        <span>{username}</span>
      </Link>

      {/* CENTER – App name + Search */}
      <div className="d-flex align-items-center gap-3">
        <h5 className="m-0 fw-bold">MySocial</h5>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          style={{ width: "200px" }}
        />
        {/* RIGHT – Logout */}
      <button
        onClick={logoutHandler}
        className="btn btn-danger btn-sm"
      >
        Logout
      </button>
      </div>
    </nav>
  );
};

export default Navbar;
