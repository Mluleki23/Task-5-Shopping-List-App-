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
