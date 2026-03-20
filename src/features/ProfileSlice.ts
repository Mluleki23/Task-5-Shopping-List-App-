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
  async (email: string, thunkAPI) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // First try json-server
    try {
      const response = await axios.get(
        `http://localhost:4000/users?email=${encodeURIComponent(email)}`
      );
      const serverUser = response.data?.[0];
      if (serverUser) {
        return {
          name: serverUser.name,
          surname: serverUser.surname,
          email: serverUser.email,
          cell: serverUser.cell,
        };
      }
    } catch {
      console.log("json-server not available for profile fetch, falling back to localStorage");
    }

    // Fallback to localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = existingUsers.find((u: any) => u.email === email);

    if (!user) {
      return thunkAPI.rejectWithValue("User not found");
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
    originalEmail?: string; // Original email to search by
  }, thunkAPI) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get users from localStorage
    let existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // If localStorage is empty, try to fetch from json-server
    if (existingUsers.length === 0) {
      try {
        console.log("localStorage users is empty, fetching from json-server");
        const response = await axios.get("http://localhost:4000/users");
        existingUsers = response.data;
        localStorage.setItem("users", JSON.stringify(existingUsers));
        console.log("Synced users from json-server to localStorage");
      } catch (err) {
        console.error("Failed to fetch users from json-server");
      }
    }
    
    // Search by original email (or new email if originalEmail not provided)
    const searchEmail = userData.originalEmail || userData.email;
    console.log("ProfileSlice updateProfile - Searching for user with email:", searchEmail);
    console.log("Available users in localStorage:", existingUsers.map((u: any) => u.email));
    
    const userIndex = existingUsers.findIndex(
      (u: any) => u.email === searchEmail
    );

    if (userIndex === -1) {
      const errorMsg = `User with email "${searchEmail}" not found in localStorage`;
      console.error(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }

    console.log("Found user at index:", userIndex);

    // Update user data (keeping the ID, password, etc.)
    existingUsers[userIndex] = {
      ...existingUsers[userIndex],
      name: userData.name,
      surname: userData.surname,
      email: userData.email, // Update email if changed
      cell: userData.cell,
    };

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));
    console.log("Updated localStorage with new user data");

    // Optionally update json-server if available
    try {
      const response = await axios.get("http://localhost:4000/users");
      const users = response.data;
      const serverUser = users.find((u: any) => u.email === searchEmail);

      if (serverUser) {
        await axios.put(`http://localhost:4000/users/${serverUser.id}`, {
          ...serverUser,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          cell: userData.cell,
        });
        console.log("Updated user on json-server");
      }
    } catch (err) {
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
    clearError: (state) => {
      state.error = null;
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

export const { setProfileData, clearError, resetProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
