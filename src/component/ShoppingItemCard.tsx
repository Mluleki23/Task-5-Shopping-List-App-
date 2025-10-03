import React from "react";
import type { ShoppingItem } from "../features/ShoppingListSlice";
import "../App.css";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
}

const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({
  item,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
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

      <div className="item-actions">
        <button className="btn btn-edit" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ShoppingItemCard;
