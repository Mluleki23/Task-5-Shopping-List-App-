// src/features/RegisterSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface RegisterState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RegisterState = {
  status: "idle",
  error: null,
};

// Register user with localStorage and json-server
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
      // Save to localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = existingUsers.some(
        (user: any) => user.email === newUser.email
      );
      if (userExists) {
        return thunkAPI.rejectWithValue("Email already registered");
      }

      const userWithId = { ...newUser, id: Date.now().toString() };
      existingUsers.push(userWithId);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Try to save to json-server
      try {
        const response = await axios.post(
          "http://localhost:5000/users",
          userWithId
        );
        return response.data;
      } catch {
        console.log("json-server not available, saved to localStorage only");
        return userWithId; // still return success from localStorage
      }
    } catch (err) {
      return thunkAPI.rejectWithValue("Registration failed");
    }
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
