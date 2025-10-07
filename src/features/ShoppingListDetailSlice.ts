import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

export interface ShoppingListDetailState {
  id: string | null;
  name: string;
  createdAt: string | null;
  updatedAt: string | null;
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListDetailState = {
  id: null,
  name: "",
  createdAt: null,
  updatedAt: null,
  items: [],
  loading: false,
  error: null,
};

const shoppingListDetailSlice = createSlice({
  name: "shoppingListDetail",
  initialState,
  reducers: {
    setListDetail: (
      state,
      action: PayloadAction<Partial<ShoppingListDetailState>>
    ) => {
      Object.assign(state, action.payload);
    },
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleItemCompleted: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.completed = !item.completed;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearListDetail: () => initialState,
  },
});

export const {
  setListDetail,
  addItem,
  removeItem,
  toggleItemCompleted,
  setLoading,
  setError,
  clearListDetail,
} = shoppingListDetailSlice.actions;

export default shoppingListDetailSlice.reducer;
