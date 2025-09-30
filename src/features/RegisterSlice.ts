import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface RegisterState {
  username: string;
  password: string;
  email: string;
}

// Define the initial state using that type
const initialState: RegisterState = {
 username: "",
    password: "",
    email: "",
}

export const RegisterSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});





export default RegisterSlice.reducer;