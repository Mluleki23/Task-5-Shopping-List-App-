import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "./src/features/LoginSlice";
import RegisterReducer from "./src/features/RegisterSlice";
import ProfileReducer from "./src/features/ProfileSlice";
import ShoppingListReducer from "./src/features/ShoppingListSlice";
import ShoppingListDetailReducer from "./src/features/ShoppingListDetailSlice"; // ✅ new import

export const store = configureStore({
  reducer: {
    login: LoginReducer,
    register: RegisterReducer,
    profile: ProfileReducer,
    shoppingList: ShoppingListReducer,
    shoppingListDetail: ShoppingListDetailReducer, // ✅ add here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
