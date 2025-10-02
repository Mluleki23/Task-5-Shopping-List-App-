// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ShoppingList from "./pages/ShoppingList";
import NavBar from "./component/NavBar";
import Profile from "./pages/Profile";

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
<<<<<<< HEAD
        <Route path="/shopping-list" element={<ShoppingList />} />
=======
>>>>>>> main
      </Routes>
    </>
  );
}
