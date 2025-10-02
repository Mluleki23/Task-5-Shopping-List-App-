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
