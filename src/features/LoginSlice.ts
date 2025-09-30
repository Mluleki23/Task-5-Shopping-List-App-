import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface LoginState {
  email: string;
  password: string;
}


// Define the initial state using that type
const initialState: LoginState = {
 email: "dlozi@gmail.com",
    password: "123456",
}

export const LoginSlice = createSlice({
  name: "login",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
   
  },
});







export default LoginSlice.reducer;