// ShoppingLists.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../App.css";

interface ShoppingList {
  id: string;
  name: string;
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
  const [newListName, setNewListName] = useState("");

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

  // Add new list
  const handleAddList = () => {
    if (!newListName.trim()) return;
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...lists, newList];
    setLists(updated);
    localStorage.setItem("shoppingLists", JSON.stringify(updated));
    setNewListName("");
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

      <div className="add-list-box">
        <input
          type="text"
          placeholder="Enter new list name..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button onClick={handleAddList} className="btn btn-primary">
          + Add List
        </button>
      </div>

      <div className="lists-container">
        {filtered.length === 0 ? (
          <p>No lists found.</p>
        ) : (
          filtered.map((list) => (
            <div key={list.id} className="list-card">
              <h3>{list.name}</h3>
              <p>
                Created:{" "}
                {new Date(list.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <button
                className="btn btn-outline"
                onClick={() => navigate(`/lists/${list.id}`)}
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShoppingLists;
