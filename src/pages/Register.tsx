import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/RegisterSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";

export default function Register() {
  const dispatch = useDispatch();
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        alignItems: "center",
        background: "#F4F4F4",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />

        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formData.surname}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />

        <input
          type="tel"
          name="cell"
          placeholder="Cell Number"
          value={formData.cell}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            padding: "0.7rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.7rem",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Register
        </button>

        {status === "loading" && <p>Registering...</p>}
        {status === "succeeded" && (
          <p style={{ color: "green" }}>Registration successful!</p>
        )}
        {status === "failed" && <p style={{ color: "red" }}>{error || "Something went wrong"}</p>}

        <p style={{ textAlign: "center", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#007bff", textDecoration: "none", fontWeight: "500" }}>
            Log in here
          </a>
        </p>
      </form>
    </div>
  );
}
