import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function NavBar() {
  return (
    <div className="navbar">
      <Link to="/home" className="navbar-link">
        Home
      </Link>
      <Link to="/shopping-list" className="navbar-link">
        Shopping List
      </Link>
      <Link to="/profile" className="navbar-link">
        Profile
      </Link>
      <Link to="/register" className="navbar-link">
        Register
      </Link>
      <Link to="/login" className="navbar-link">
        Login
      </Link>
    </div>
  );
}
