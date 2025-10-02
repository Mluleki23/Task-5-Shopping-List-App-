import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  filter: "all" | "active" | "completed";
}

const loadItemsFromStorage = (): ShoppingItem[] => {
  const stored = localStorage.getItem("shoppingList");
  return stored ? JSON.parse(stored) : [];
};

const initialState: ShoppingListState = {
  items: loadItemsFromStorage(),
  filter: "all",
};

export const ShoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<ShoppingItem, "id" | "completed" | "createdAt">>) => {
      const newItem: ShoppingItem = {
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newItem);
      localStorage.setItem("shoppingList", JSON.stringify(state.items));
    },
    updateItem: (state, action: PayloadAction<ShoppingItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        localStorage.setItem("shoppingList", JSON.stringify(state.items));
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("shoppingList", JSON.stringify(state.items));
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.completed = !item.completed;
        localStorage.setItem("shoppingList", JSON.stringify(state.items));
      }
    },
    setFilter: (state, action: PayloadAction<"all" | "active" | "completed">) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
      localStorage.setItem("shoppingList", JSON.stringify(state.items));
    },
  },
});

export const { addItem, updateItem, deleteItem, toggleComplete, setFilter, clearCompleted } = ShoppingListSlice.actions;
export default ShoppingListSlice.reducer;
