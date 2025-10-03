import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

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

// Fetch user profile from localStorage
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = existingUsers.find((u: any) => u.email === email);

    if (!user) {
      throw new Error("User not found");
    }

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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = existingUsers.findIndex(
      (u: any) => u.email === userData.email
    );

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user data
    existingUsers[userIndex] = {
      ...existingUsers[userIndex],
      name: userData.name,
      surname: userData.surname,
      cell: userData.cell,
    };

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // Optionally update json-server if available
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
    } catch {
      console.log("json-server not available, updated localStorage only");
    }

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
      // Fetch profile
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
      // Update profile
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
