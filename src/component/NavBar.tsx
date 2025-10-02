import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function NavBar() {
  return (
<<<<<<< HEAD
    <div className="navbar">
      <Link to="/home" className="navbar-link">
=======
    <div
      className="NavBar"
      style={{
        backgroundColor: "blue",
        width: "100%",
        padding: "1rem",
        color: "white",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxSizing: "border-box",
        borderRadius: "0 0 10px 10px",
      }}
    >
      <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
>>>>>>> main
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
