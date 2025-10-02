<<<<<<< HEAD
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
=======
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
>>>>>>> main

export interface ProfileState {
  name: string;
  surname: string;
  email: string;
  cell: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  name: "",
  surname: "",
  email: "",
  cell: "",
  status: "idle",
  error: null,
};

<<<<<<< HEAD
// Fetch user profile from json-server or localStorage
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (email: string) => {
    let users = [];
    
    // Try json-server first
    try {
      const response = await axios.get("http://localhost:5000/users");
      users = response.data;
    } catch (serverError) {
      // Fall back to localStorage
      console.log("json-server not available, using localStorage");
      users = JSON.parse(localStorage.getItem("users") || "[]");
    }
    
    // Find user by email
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      throw new Error("User not found");
    }
    
=======
// Fetch user profile from localStorage
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (email: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Find user by email
    const user = existingUsers.find((u: any) => u.email === email);

    if (!user) {
      throw new Error("User not found");
    }

>>>>>>> main
    return {
      name: user.name,
      surname: user.surname,
      email: user.email,
      cell: user.cell,
    };
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (userData: {
    email: string;
    name: string;
    surname: string;
    cell: string;
  }) => {
<<<<<<< HEAD
    // Update in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = existingUsers.findIndex((u: any) => u.email === userData.email);
    
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
=======
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Find and update user
    const userIndex = existingUsers.findIndex(
      (u: any) => u.email === userData.email
    );

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user data (keep password unchanged)
>>>>>>> main
    existingUsers[userIndex] = {
      ...existingUsers[userIndex],
      name: userData.name,
      surname: userData.surname,
      cell: userData.cell,
    };
<<<<<<< HEAD
    localStorage.setItem("users", JSON.stringify(existingUsers));
    
    // Try to update in json-server if available
    try {
      const response = await axios.get("http://localhost:5000/users");
      const users = response.data;
      const serverUser = users.find((u: any) => u.email === userData.email);
      
      if (serverUser) {
        await axios.put(`http://localhost:5000/users/${serverUser.id}`, {
          ...serverUser,
          name: userData.name,
          surname: userData.surname,
          cell: userData.cell,
        });
      }
    } catch (serverError) {
      console.log("json-server not available, updated localStorage only");
    }
    
=======

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

>>>>>>> main
    return {
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      cell: userData.cell,
    };
  }
);

export const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (
      state,
      action: PayloadAction<{
        name: string;
        surname: string;
        email: string;
        cell: string;
      }>
    ) => {
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.email = action.payload.email;
      state.cell = action.payload.cell;
    },
    resetProfile: (state) => {
      state.name = "";
      state.surname = "";
      state.email = "";
      state.cell = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.email = action.payload.email;
        state.cell = action.payload.cell;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch profile";
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.email = action.payload.email;
        state.cell = action.payload.cell;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update profile";
      });
  },
});

export const { setProfileData, resetProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
