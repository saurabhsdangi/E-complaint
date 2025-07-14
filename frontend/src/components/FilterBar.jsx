import React from "react";

const FilterBar = ({ category, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-4">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Categories</option>
        <option value="Complaint">Complaint</option>
        <option value="Suggestion">Suggestion</option>
        <option value="Idea">Idea</option>
      </select>
    </div>
  );
};

export default FilterBar;
