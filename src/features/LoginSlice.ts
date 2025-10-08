// src/redux/slices/LoginSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface LoginState {
  loading: boolean;
  error: string | null;
  user: any | null;
}

// Check if user is already logged in from localStorage
const storedUser = localStorage.getItem("user");
const initialState: LoginState = {
  loading: false,
  error: null,
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      let users = [];
      
      // Try to get users from json-server first
      try {
        const response = await axios.get("http://localhost:5000/users");
        users = response.data;
      } catch (serverError) {
        // If json-server is not running, fall back to localStorage
        console.log("json-server not available, using localStorage");
        users = JSON.parse(localStorage.getItem("users") || "[]");
      }
      
      // Find user with matching email and password
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        return thunkAPI.rejectWithValue("Invalid email or password");
      }
      
      // Return user data (without password)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        cell: user.cell,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);

const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = LoginSlice.actions;
export default LoginSlice.reducer;
