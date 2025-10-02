import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { addItem, deleteItem, toggleComplete, setFilter, clearCompleted } from "../features/ShoppingListSlice";
import AddItemModal from "../component/AddItemModal";
import ShoppingItemCard from "../component/ShoppingItemCard";
import "../App.css";

const ShoppingList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, filter } = useSelector((state: RootState) => state.shoppingList);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter(item => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const handleAddItem = (itemData: any) => {
    dispatch(addItem(itemData));
    setIsModalOpen(false);
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleComplete(id));
  };

  const handleDeleteItem = (id: string) => {
    dispatch(deleteItem(id));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const activeCount = items.filter(item => !item.completed).length;
  const completedCount = items.filter(item => item.completed).length;

  return (
    <div className="shopping-list-page">
      <div className="shopping-list-container">
        <div className="shopping-list-header">
          <h1>My Shopping List</h1>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Item
          </button>
        </div>

        <div className="shopping-list-stats">
          <div className="stat-item">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{items.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        <div className="shopping-list-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => dispatch(setFilter("all"))}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => dispatch(setFilter("active"))}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => dispatch(setFilter("completed"))}
          >
            Completed
          </button>
          {completedCount > 0 && (
            <button className="btn btn-outline" onClick={handleClearCompleted}>
              Clear Completed
            </button>
          )}
        </div>

        <div className="shopping-list-items">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>No items found</p>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Add your first item
              </button>
            </div>
          ) : (
            filteredItems.map(item => (
              <ShoppingItemCard
                key={item.id}
                item={item}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteItem}
              />
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddItemModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
};

export default ShoppingList;
