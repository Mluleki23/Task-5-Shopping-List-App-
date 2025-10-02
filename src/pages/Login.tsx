// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store";
import { loginUser } from "../features/LoginSlice";
import "../App.css";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state: RootState) => state.login);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="login-container">
        <h1>Login</h1>
        <p>Please enter your credentials to sign in.</p>
        <hr />

        <label htmlFor="email" className="form-label">Email</label>
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

        <label htmlFor="password" className="form-label">Password</label>
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
          <p>Don't have an account? <a href="/register">Register</a>.</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
