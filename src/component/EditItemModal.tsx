import React, { useState } from "react";
import type { ShoppingItem } from "../features/ShoppingListSlice";
import "../App.css";

interface EditItemModalProps {
  item: ShoppingItem;
  onClose: () => void;
  onUpdate: (item: ShoppingItem) => void;
}

const categories = [
  "Groceries",
  "Fruits & Vegetables",
  "Dairy",
  "Meat & Seafood",
  "Bakery",
  "Beverages",
  "Household",
  "Personal Care",
  "Other",
];

const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: item.name,
    quantity: item.quantity,
    notes: item.notes || "",
    category: item.category,
    image: item.image || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onUpdate({
        ...item,
        name: formData.name,
        quantity: formData.quantity,
        notes: formData.notes || undefined,
        category: formData.category,
        image: formData.image || undefined,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Item</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Milk, Bread, Apples"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-input"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Item Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="form-input"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
