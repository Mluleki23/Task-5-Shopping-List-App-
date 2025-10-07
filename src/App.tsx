// src/App.tsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./component/NavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ShoppingList from "./pages/ShoppingList";
import ShoppingLists from "./pages/ShoppingListDetail";
import ShoppingListDetail from "./pages/ShoppingListDetail";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/lists" element={<ShoppingLists />} />
        <Route path="/lists/:listId" element={<ShoppingListDetail />} />
      </Routes>
    </>
  );
}
