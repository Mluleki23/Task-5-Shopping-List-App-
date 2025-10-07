// ShoppingLists.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../App.css";

interface ShoppingList {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
  createdAt: string;
}

const ShoppingLists: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const stored = localStorage.getItem("shoppingLists");
    return stored ? JSON.parse(stored) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    category: "Groceries",
    notes: "",
    image: "",
  });

  const searchQuery = searchParams.get("search") || "";

  // Update URL search param
  const handleSearchChange = (value: string) => {
    if (value) setSearchParams({ search: value });
    else setSearchParams({});
  };

  // Filter + sort
  const filtered = lists
    .filter((list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Add or update list
  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    if (editingId) {
      // Update existing list
      const updated = lists.map((list) =>
        list.id === editingId
          ? {
              ...list,
              name: form.name.trim(),
              quantity: form.quantity,
              category: form.category,
              notes: form.notes.trim() || undefined,
              image: form.image.trim() || undefined,
            }
          : list
      );
      setLists(updated);
      localStorage.setItem("shoppingLists", JSON.stringify(updated));
      setEditingId(null);
    } else {
      // Add new list
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: form.name.trim(),
        quantity: form.quantity,
        category: form.category,
        notes: form.notes.trim() || undefined,
        image: form.image.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      const updated = [...lists, newList];
      setLists(updated);
      localStorage.setItem("shoppingLists", JSON.stringify(updated));
    }
    
    setForm({ name: "", quantity: 1, category: "Groceries", notes: "", image: "" });
    setShowModal(false);
  };

  // Edit list
  const handleEditList = (list: ShoppingList) => {
    setEditingId(list.id);
    setForm({
      name: list.name,
      quantity: list.quantity,
      category: list.category,
      notes: list.notes || "",
      image: list.image || "",
    });
    setShowModal(true);
  };

  // Delete list
  const handleDeleteList = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updated = lists.filter((list) => list.id !== id);
      setLists(updated);
      localStorage.setItem("shoppingLists", JSON.stringify(updated));
    }
  };

  return (
    <div className="shopping-lists-page">
      <h1>My Shopping Lists</h1>

      <div className="list-controls">
        <input
          type="text"
          placeholder="Search lists..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "date")}
        >
          <option value="date">Date Added</option>
          <option value="name">Name</option>
        </select>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={() => setShowModal(true)}
        style={{ marginBottom: "1.5rem" }}
      >
        + Add New Item
      </button>

      {/* Modal for adding items */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setEditingId(null);
                setForm({ name: "", quantity: 1, category: "Groceries", notes: "", image: "" });
              }}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddList} className="modal-form">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter item name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Groceries</option>
                    <option>Fruits & Vegetables</option>
                    <option>Dairy</option>
                    <option>Meat & Seafood</option>
                    <option>Bakery</option>
                    <option>Beverages</option>
                    <option>Household</option>
                    <option>Personal Care</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                {form.image && (
                  <div className="image-preview">
                    <img src={form.image} alt="Preview" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add any additional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setForm({ name: "", quantity: 1, category: "Groceries", notes: "", image: "" });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="lists-container">
        {filtered.length === 0 ? (
          <p>No lists found.</p>
        ) : (
          filtered.map((list) => (
            <div key={list.id} className="list-card">
              {list.image && (
                <img 
                  src={list.image} 
                  alt={list.name}
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px 8px 0 0", marginBottom: "1rem" }}
                />
              )}
              <h3>{list.name}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                <strong>Quantity:</strong> {list.quantity} | <strong>Category:</strong> {list.category}
              </p>
              {list.notes && (
                <p style={{ color: "#888", fontSize: "0.85rem", fontStyle: "italic", marginTop: "0.5rem" }}>
                  {list.notes}
                </p>
              )}
              <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>
                Created: {new Date(list.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div style={{ display: "flex", gap: "0.3rem", marginTop: "1rem" }}>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/lists/${list.id}`)}
                >
                  View
                </button>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEditList(list)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteList(list.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShoppingLists;
