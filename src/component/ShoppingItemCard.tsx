import React from "react";
import type { ShoppingItem } from "../features/ShoppingListSlice";
import "../App.css";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item, onToggleComplete, onDelete }) => {
  return (
    <div className={`shopping-item-card ${item.completed ? "completed" : ""}`}>
      <div className="item-checkbox">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggleComplete(item.id)}
          id={`item-${item.id}`}
        />
      </div>

      {item.image && (
        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>
      )}

      <div className="item-details">
        <div className="item-header">
          <h3 className="item-name">{item.name}</h3>
          <span className="item-category">{item.category}</span>
        </div>
        <div className="item-quantity">Quantity: {item.quantity}</div>
        {item.notes && <p className="item-notes">{item.notes}</p>}
      </div>

      <button
        className="item-delete"
        onClick={() => onDelete(item.id)}
        title="Delete item"
      >
        🗑️
      </button>
    </div>
  );
};

export default ShoppingItemCard;
