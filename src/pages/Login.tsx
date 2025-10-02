// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom"; // ✅ new import
>>>>>>> main
import type { RootState, AppDispatch } from "../../store";
import { loginUser } from "../features/LoginSlice";
import "../App.css";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
<<<<<<< HEAD
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state: RootState) => state.login);
  const [hasSubmitted, setHasSubmitted] = useState(false);
=======
  const navigate = useNavigate(); // ✅ hook for navigation
  const { loading, error, user } = useSelector(
    (state: RootState) => state.login
  );
>>>>>>> main

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect to profile after successful login (only after form submission)
  useEffect(() => {
    if (user && hasSubmitted) {
      navigate("/profile");
    }
  }, [user, hasSubmitted, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    dispatch(loginUser(formData));
  };

  // ✅ Redirect to profile when user is logged in
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="login-container">
        <h1>Login</h1>
        <p>Please enter your credentials to sign in.</p>
        <hr />

<<<<<<< HEAD
        <label htmlFor="email" className="form-label">Email</label>
=======
        <label htmlFor="email" className="form-label">
          Email
        </label>
>>>>>>> main
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />

<<<<<<< HEAD
        <label htmlFor="password" className="form-label">Password</label>
=======
        <label htmlFor="password" className="form-label">
          Password
        </label>
>>>>>>> main
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          id="password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="message-error">{error}</p>}

        <div className="signin-link">
<<<<<<< HEAD
          <p>Don't have an account? <a href="/register">Register</a>.</p>
=======
          <p>
            Don't have an account? <a href="/register">Register</a>.
          </p>
>>>>>>> main
        </div>
      </form>
    </div>
  );
};

export default Login;
