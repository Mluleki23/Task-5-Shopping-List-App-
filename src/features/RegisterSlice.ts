import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface RegisterState {
  email: string;
  password: string;
  name: string;
  surname: string;
  cell: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RegisterState = {
  email: "",
  password: "",
  name: "",
  surname: "",
  cell: "",
  status: "idle",
  error: null,
};

// Example async thunk if you call API
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    cell: string;
  }) => {
    // replace with your real API endpoint
    const response = await axios.post(
      "http://localhost:5000/api/register",
      userData
    );
    return response.data;
  }
);

export const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterData: (
      state,
      action: PayloadAction<{
        email: string;
        password: string;
        name: string;
        surname: string;
        cell: string;
      }>
    ) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.cell = action.payload.cell;
    },
    resetRegister: (state) => {
      state.email = "";
      state.password = "";
      state.name = "";
      state.surname = "";
      state.cell = "";
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.cell = action.payload.cell;
        state.password = ""; // clear for security
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const { setRegisterData, resetRegister } = RegisterSlice.actions;
export default RegisterSlice.reducer;
