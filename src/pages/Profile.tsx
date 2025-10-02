import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../features/ProfileSlice";
import type { RootState, AppDispatch } from "../../store";
import "../App.css";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, surname, email, cell, status, error } = useSelector(
    (state: RootState) => state.profile
  );
  const loggedInUser = useSelector((state: RootState) => state.login.user);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    cell: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (loggedInUser?.email) {
      dispatch(fetchProfile(loggedInUser.email));
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    if (name && surname && cell && email) {
      setFormData({ name, surname, cell, email });
    }
  }, [name, surname, cell, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      dispatch(updateProfile({ ...formData, email: formData.email }));
      setIsEditing(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = existingUsers.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      setPasswordError("User not found");
      return;
    }

    if (existingUsers[userIndex].password !== passwordData.currentPassword) {
      setPasswordError("Current password is incorrect");
      return;
    }

    existingUsers[userIndex].password = passwordData.newPassword;
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setPasswordSuccess("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess("");
    }, 2000);
  };

  if (!loggedInUser) {
    return (
      <div className="auth-guard">
        <h2>Please login to view your profile</h2>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>
        {status === "loading" && <p className="message-loading">Loading...</p>}
        {error && <p className="message-error">{error}</p>}

        {!isEditing && !isChangingPassword && (
          <div className="profile-info">
            <div className="profile-field">
              <strong>Name:</strong>
              <div className="profile-field-value">{name}</div>
            </div>
            <div className="profile-field">
              <strong>Surname:</strong>
              <div className="profile-field-value">{surname}</div>
            </div>
            <div className="profile-field">
              <strong>Email:</strong>
              <div className="profile-field-value">{email}</div>
            </div>
            <div className="profile-field">
              <strong>Cell:</strong>
              <div className="profile-field-value">{cell}</div>
            </div>
            <div className="profile-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn btn-secondary"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="surname" className="form-label">
                Surname:
              </label>
              <input
                type="text"
                name="surname"
                id="surname"
                className="form-input"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cell" className="form-label">
                Cell:
              </label>
              <input
                type="tel"
                name="cell"
                id="cell"
                className="form-input"
                value={formData.cell}
                onChange={handleChange}
                required
              />
            </div>
            <div className="btn-group">
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-success"
              >
                {status === "loading" ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name, surname, cell, email });
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isChangingPassword && (
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Current Password:
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password:
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="form-input"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>
            {passwordError && <p className="message-error">{passwordError}</p>}
            {passwordSuccess && (
              <p className="message-success">{passwordSuccess}</p>
            )}
            <div className="btn-group">
              <button type="submit" className="btn btn-green">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
