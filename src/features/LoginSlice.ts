// src/redux/slices/LoginSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface LoginState {
  loading: boolean;
  error: string | null;
  user: any | null;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  user: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Find user with matching email and password
      const user = existingUsers.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        return thunkAPI.rejectWithValue("Invalid email or password");
      }
      
      // Return user data (without password)
      return {
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
