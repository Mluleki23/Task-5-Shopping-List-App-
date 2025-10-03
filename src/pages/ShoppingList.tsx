import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store";
import {
  addItem,
  deleteItem,
  toggleComplete,
  updateItem,
  setFilter,
  clearCompleted,
} from "../features/ShoppingListSlice";
import AddItemModal from "../component/AddItemModal";
import EditItemModal from "../component/EditItemModal";
import ShoppingItemCard from "../component/ShoppingItemCard";
import type { ShoppingItem } from "../features/ShoppingListSlice";
import "../App.css";

const ShoppingList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, filter } = useSelector(
    (state: RootState) => state.shoppingList
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"name" | "category" | "date">("date");

  // Get search query from URL
  const searchQuery = searchParams.get("search") || "";

  // Update URL when search changes
  const handleSearchChange = (value: string) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // Filter items by search query
  const searchedItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (filter === "active") return !item.completed && matchesSearch;
    if (filter === "completed") return item.completed && matchesSearch;
    return matchesSearch;
  });

  // Sort items
  const sortedItems = [...searchedItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "category":
        return a.category.localeCompare(b.category);
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const handleAddItem = (itemData: any) => {
    dispatch(addItem(itemData));
    setIsModalOpen(false);
  };

  const handleUpdateItem = (item: ShoppingItem) => {
    dispatch(updateItem(item));
    setEditingItem(null);
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

  const activeCount = items.filter((item) => !item.completed).length;
  const completedCount = items.filter((item) => item.completed).length;

  return (
    <div className="shopping-list-page">
      <div className="shopping-list-container">
        <div className="shopping-list-header">
          <h1>My Shopping List</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
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

        {/* Search and Sort Controls */}
        <div className="shopping-list-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search items by name..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="sort-box">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "category" | "date")
              }
            >
              <option value="date">Date Added</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
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
          {sortedItems.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery
                  ? `No items found matching "${searchQuery}"`
                  : "No items found"}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Add your first item
              </button>
            </div>
          ) : (
            sortedItems.map((item: ShoppingItem) => (
              <ShoppingItemCard
                key={item.id}
                item={item}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteItem}
                onEdit={setEditingItem}
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

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
};

export default ShoppingList;
