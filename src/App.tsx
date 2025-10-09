// src/App.tsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ShoppingList from "./pages/ShoppingList";
import ShoppingLists from "./pages/ShoppingListDetail";
import ShoppingListDetail from "./pages/ShoppingListDetail";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/lists" element={<ShoppingLists />} />
          <Route path="/lists/:listId" element={<ShoppingListDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
