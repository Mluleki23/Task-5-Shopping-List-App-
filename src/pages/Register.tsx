// src/pages/Register.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/RegisterSlice";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store";
import "../App.css";

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector((state: RootState) => state.register.status);
  const error = useSelector((state: RootState) => state.register.error);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    cell: "",
    email: "",
    password: "",
  });

  // Navigate to login after successful registration
  useEffect(() => {
    if (status === "succeeded") {
      navigate("/login");
    }
  }, [status, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData) as any);
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-input"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="surname"
          placeholder="Surname"
          className="form-input"
          value={formData.surname}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="cell"
          placeholder="Cell Number"
          className="form-input"
          value={formData.cell}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-btn">
           Register
         </button>

        {status === "loading" && (
          <p className="message-loading">Registering...</p>
        )}
        {status === "succeeded" && (
          <p className="message-success">Registration successful!</p>
        )}
        {status === "failed" && (
          <p className="message-error">{error || "Something went wrong"}</p>
        )}

        <p className="register-text">
          Already have an account?{" "}
          <a href="/login" className="register-link">
            Log in here
          </a>
        </p>
      </form>
    </div>
  );
}
