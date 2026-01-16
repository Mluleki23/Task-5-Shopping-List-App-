import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { logout } from "../features/LoginSlice";
import "../App.css";

export default function NavBar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.login.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">ShopWise</div>
      <div className="navbar-links">
        <Link to="/home" className="navbar-link">
          Home
        </Link>
        {currentUser ? (
          <>
            <Link to="/shopping-list" className="navbar-link">
              Shopping List
            </Link>
            <Link to="/profile" className="navbar-link">
              Profile
            </Link>
            <button onClick={handleLogout} className="navbar-link">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
