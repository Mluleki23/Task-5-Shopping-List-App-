import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function NavBar() {
  return (
    <div
      className="navbar"
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
        Home
      </Link>
      <Link
        to="/shopping-list"
        style={{ color: "white", textDecoration: "none" }}
      >
        Shopping List
      </Link>
      <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
        Profile
      </Link>
      <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
        Register
      </Link>
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
        Login
      </Link>
    </div>
  );
}
