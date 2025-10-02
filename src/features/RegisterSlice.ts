<<<<<<< HEAD
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
=======
// src/features/RegisterSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
>>>>>>> main
import axios from "axios";

interface RegisterState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RegisterState = {
  status: "idle",
  error: null,
};

<<<<<<< HEAD
// Register user with json-server and localStorage
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    cell: string;
  }) => {
    // Always save to localStorage first
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user already exists
    const userExists = existingUsers.some((user: any) => user.email === userData.email);
    if (userExists) {
      throw new Error("User with this email already exists");
    }
    
    existingUsers.push(userData);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    
    // Try to save to json-server if available
    try {
      const response = await axios.post("http://localhost:5000/users", userData);
      return {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        surname: response.data.surname,
        cell: response.data.cell,
      };
    } catch (serverError) {
      // If json-server fails, still return success since we saved to localStorage
      console.log("json-server not available, saved to localStorage only");
      return {
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        cell: userData.cell,
      };
    }
=======
// ✅ Register thunk
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (
    newUser: {
      name: string;
      surname: string;
      cell: string;
      email: string;
      password: string;
    },
    thunkAPI
  ) => {
    try {
      // check if email already exists
      const existing = await axios.get("http://localhost:5000/users", {
        params: { email: newUser.email },
      });

      if (existing.data.length > 0) {
        return thunkAPI.rejectWithValue("Email already registered");
      }

      // save new user into db.json
      const response = await axios.post("http://localhost:5000/users", newUser);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Registration failed");
    }
>>>>>>> main
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default registerSlice.reducer;
