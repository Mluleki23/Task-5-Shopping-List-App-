import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  completed: boolean;
  createdAt: string;
}

export interface ShoppingListState {
  items: ShoppingItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filter: "all" | "active" | "completed";
}

const initialState: ShoppingListState = {
  items: [],
  status: "idle",
  error: null,
  filter: "all",
};

// ✅ Fetch all items
export const fetchItems = createAsyncThunk(
  "shoppingList/fetchItems",
  async () => {
    const res = await axios.get("http://localhost:5000/shoppingList");
    return res.data;
  }
);

// ✅ Add new item
export const addItem = createAsyncThunk(
  "shoppingList/addItem",
  async (itemData: Omit<ShoppingItem, "id" | "completed" | "createdAt">) => {
    const newItem = {
      ...itemData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const res = await axios.post("http://localhost:5000/shoppingList", newItem);
    return res.data;
  }
);

// ✅ Delete item
export const deleteItem = createAsyncThunk(
  "shoppingList/deleteItem",
  async (id: string) => {
    await axios.delete(`http://localhost:5000/shoppingList/${id}`);
    return id;
  }
);

// ✅ Toggle complete
export const toggleComplete = createAsyncThunk(
  "shoppingList/toggleComplete",
  async (id: string) => {
    const res = await axios.get(`http://localhost:5000/shoppingList/${id}`);
    const updated = { ...res.data, completed: !res.data.completed };
    await axios.put(`http://localhost:5000/shoppingList/${id}`, updated);
    return updated;
  }
);

const ShoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<"all" | "active" | "completed">
    ) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch items";
      })
      // add
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // delete
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // toggle
      .addCase(toggleComplete.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { setFilter } = ShoppingListSlice.actions;
export default ShoppingListSlice.reducer;
