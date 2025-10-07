// ShoppingListDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

interface Item {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
  completed: boolean;
  createdAt: string;
}

const ShoppingListDetail: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    category: "Groceries",
    notes: "",
    image: "",
  });
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "date" | "quantity"
  >("date");

  // Load list items
  useEffect(() => {
    const stored = localStorage.getItem(`items_${listId}`);
    setItems(stored ? JSON.parse(stored) : []);
  }, [listId]);

  const saveItems = (updated: Item[]) => {
    setItems(updated);
    localStorage.setItem(`items_${listId}`, JSON.stringify(updated));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      name: form.name.trim(),
      quantity: form.quantity,
      category: form.category,
      notes: form.notes.trim() || undefined,
      image: form.image.trim() || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...items, newItem];
    saveItems(updated);
    setForm({ name: "", quantity: 1, category: "Groceries", notes: "", image: "" });
    setShowModal(false);
  };

  const toggleComplete = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, completed: !i.completed } : i
    );
    saveItems(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
  };

  // Sorting
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "category":
        return a.category.localeCompare(b.category);
      case "quantity":
        return a.quantity - b.quantity;
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return (
    <div className="list-detail-page">
      <button className="btn btn-outline" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Shopping List Items</h2>

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
              <h2>Add New Item</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddItem} className="modal-form">
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

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sort-section">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as "name" | "category" | "date" | "quantity"
            )
          }
        >
          <option value="date">Date Added</option>
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="quantity">Quantity</option>
        </select>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>✔</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id} className={item.completed ? "completed-row" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item.id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.category}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No items yet. Add one above!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShoppingListDetail;
