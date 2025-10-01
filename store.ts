import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "./src/features/LoginSlice"
import RegisterReducer from "./src/features/RegisterSlice"





export const store = configureStore({
  reducer: {
    login: LoginReducer,
    register: RegisterReducer,
   
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
