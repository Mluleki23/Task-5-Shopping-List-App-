import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchItems,
  addItem,
  deleteItem,
  toggleComplete,
  setFilter,
} from "../features/ShoppingListSlice";
import AddItemModal from "../component/AddItemModal";
import ShoppingItemCard from "../component/ShoppingItemCard";
import "../App.css";

const ShoppingList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, filter, status } = useSelector(
    (state: RootState) => state.shoppingList
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const filteredItems = items.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const handleAddItem = (itemData: any) => {
    dispatch(addItem(itemData));
    setIsModalOpen(false);
  };

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

        {status === "loading" && <p>Loading...</p>}

        <div className="shopping-list-items">
          {filteredItems.map((item) => (
            <ShoppingItemCard
              key={item.id}
              item={item}
              onToggleComplete={(id) => dispatch(toggleComplete(id))}
              onDelete={(id) => dispatch(deleteItem(id))}
            />
          ))}
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
