// ShoppingListSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/shoppingList";

export interface ShoppingItem {
  id: string;
  userId: string; // each item belongs to a user
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
  filter: "all" | "active" | "completed";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Load items for a specific user from localStorage
const loadItemsFromStorage = (userId: string): ShoppingItem[] => {
  const stored = localStorage.getItem("shoppingList");
  if (!stored) return [];
  const allItems: ShoppingItem[] = JSON.parse(stored);
  return allItems.filter((item) => item.userId === userId);
};

// Initial state (empty, filtered later per user)
const initialState: ShoppingListState = {
  items: [],
  filter: "all",
  status: "idle",
  error: null,
};

// -----------------------
// Async Thunks
// -----------------------

// Fetch all items for a user
export const fetchItems = createAsyncThunk(
  "shoppingList/fetchItems",
  async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}?userId=${userId}`);
      return response.data as ShoppingItem[];
    } catch (error) {
      return loadItemsFromStorage(userId);
    }
  }
);

// Add a new item for a user
export const addItem = createAsyncThunk(
  "shoppingList/addItem",
  async (itemData: Omit<ShoppingItem, "id" | "completed" | "createdAt">) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await axios.post(API_URL, newItem);
      return response.data;
    } catch (error) {
      // Save to localStorage if server unavailable
      const stored = localStorage.getItem("shoppingList");
      const allItems: ShoppingItem[] = stored ? JSON.parse(stored) : [];
      allItems.push(newItem);
      localStorage.setItem("shoppingList", JSON.stringify(allItems));
      return newItem;
    }
  }
);

// Update an item
export const updateItem = createAsyncThunk(
  "shoppingList/updateItem",
  async (item: ShoppingItem) => {
    try {
      const response = await axios.put(`${API_URL}/${item.id}`, item);
      return response.data;
    } catch (error) {
      const stored = localStorage.getItem("shoppingList");
      const allItems: ShoppingItem[] = stored ? JSON.parse(stored) : [];
      const index = allItems.findIndex((i) => i.id === item.id);
      if (index !== -1) allItems[index] = item;
      localStorage.setItem("shoppingList", JSON.stringify(allItems));
      return item;
    }
  }
);

// Delete an item
export const deleteItem = createAsyncThunk(
  "shoppingList/deleteItem",
  async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      const stored = localStorage.getItem("shoppingList");
      const allItems: ShoppingItem[] = stored ? JSON.parse(stored) : [];
      const filtered = allItems.filter((i) => i.id !== id);
      localStorage.setItem("shoppingList", JSON.stringify(filtered));
      return id;
    }
  }
);

// Toggle completed
export const toggleComplete = createAsyncThunk(
  "shoppingList/toggleComplete",
  async (id: string) => {
    const stored = localStorage.getItem("shoppingList");
    const allItems: ShoppingItem[] = stored ? JSON.parse(stored) : [];
    const item = allItems.find((i) => i.id === id);
    if (!item) throw new Error("Item not found");

    const updatedItem = { ...item, completed: !item.completed };
    try {
      const response = await axios.patch(`${API_URL}/${id}`, {
        completed: updatedItem.completed,
      });
      return response.data;
    } catch (error) {
      const index = allItems.findIndex((i) => i.id === id);
      if (index !== -1) allItems[index] = updatedItem;
      localStorage.setItem("shoppingList", JSON.stringify(allItems));
      return updatedItem;
    }
  }
);

// -----------------------
// Slice
// -----------------------

export const ShoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<"all" | "active" | "completed">
    ) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((item) => !item.completed);
      const stored = localStorage.getItem("shoppingList");
      const allItems: ShoppingItem[] = stored ? JSON.parse(stored) : [];
      const remaining = allItems.filter((i) => !i.completed);
      localStorage.setItem("shoppingList", JSON.stringify(remaining));
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(toggleComplete.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { setFilter, clearCompleted } = ShoppingListSlice.actions;
export default ShoppingListSlice.reducer;
