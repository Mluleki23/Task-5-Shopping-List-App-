// ShoppingListDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

interface Item {
  id: string;
  listId: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);
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
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/shoppingItems?listId=${listId}`);
        setItems(response.data);
      } catch (error) {
        // Fallback to localStorage
        const stored = localStorage.getItem(`items_${listId}`);
        setItems(stored ? JSON.parse(stored) : []);
      }
    };
    if (listId) fetchItems();
  }, [listId]);

  const saveItems = (updated: Item[]) => {
    setItems(updated);
    localStorage.setItem(`items_${listId}`, JSON.stringify(updated));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      // Update existing item
      const updatedItem = {
        ...items.find(i => i.id === editingId)!,
        name: form.name.trim(),
        quantity: form.quantity,
        category: form.category,
        notes: form.notes.trim() || undefined,
        image: form.image.trim() || undefined,
      };
      try {
        const response = await axios.put(`http://localhost:5000/shoppingItems/${editingId}`, updatedItem);
        setItems(items.map(i => i.id === editingId ? response.data : i));
      } catch (error) {
        // Fallback
        const updated = items.map(i => i.id === editingId ? updatedItem : i);
        saveItems(updated);
      }
      setEditingId(null);
    } else {
      // Add new item
      const newItem: Item = {
        id: Date.now().toString(),
        listId: listId!,
        name: form.name.trim(),
        quantity: form.quantity,
        category: form.category,
        notes: form.notes.trim() || undefined,
        image: form.image.trim() || undefined,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      try {
        const response = await axios.post("http://localhost:5000/shoppingItems", newItem);
        setItems([...items, response.data]);
      } catch (error) {
        // Fallback to localStorage
        const updated = [...items, newItem];
        saveItems(updated);
      }
    }
    setForm({ name: "", quantity: 1, category: "Groceries", notes: "", image: "" });
    setShowModal(false);
  };

  const toggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const updatedItem = { ...item, completed: !item.completed };
    try {
      await axios.patch(`http://localhost:5000/shoppingItems/${id}`, { completed: updatedItem.completed });
      setItems(items.map(i => i.id === id ? updatedItem : i));
    } catch (error) {
      // Fallback
      const updated = items.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      );
      saveItems(updated);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/shoppingItems/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      // Fallback
      const updated = items.filter((i) => i.id !== id);
      saveItems(updated);
    }
  };

  const editItem = (item: Item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      notes: item.notes || "",
      image: item.image || "",
    });
    setShowModal(true);
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
      <button className="btn btn-dark" onClick={() => navigate(-1)}>
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
              <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setEditingId(null);
                setForm({ name: "", quantity: 1, category: "Groceries", notes: "", image: "" });
              }}>
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
                  onClick={() => setShowModal(false)}
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
             <th>Image</th>
             <th>Name</th>
             <th>Quantity</th>
             <th>Category</th>
             <th>Notes</th>
             <th>Date Added</th>
             <th>Actions</th>
           </tr>
         </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id}>
              <td>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                  />
                ) : (
                  <span style={{ color: "#999" }}>No image</span>
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.category}</td>
              <td style={{ maxWidth: "200px", fontSize: "0.9rem", color: "#666" }}>
                {item.notes || <span style={{ color: "#ccc" }}>—</span>}
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-edit"
                  onClick={() => editItem(item)}
                >
                  Edit
                </button>
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
              <td colSpan={7} style={{ textAlign: "center" }}>
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
