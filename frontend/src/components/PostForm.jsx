import React, { useState, useEffect } from "react";
import axios from "../axios"; // adjust path accordingly


const PostForm = ({ onPostSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("complaint");
  const [username, setUsername] = useState("");

  // ✅ Get username from localStorage on load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) {
      setUsername(user.username);
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username) {
    alert("Username not found. Please login again.");
    return;
  }

  console.log("Submitting post with username:", username); // ✅ Add this

  const postData = {
    title,
    description,
    location,
    category,
    name: username,
  };

  try {
    await axios.post("/posts", postData);
    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("complaint");
    onPostSuccess();
  } catch (err) {
    console.error("Post creation failed:", err);
    alert("Failed to create post.");
  }
};


  return (
    <div className="bg-white p-5 rounded-lg shadow mb-8">
      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block font-medium mb-1">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block font-medium mb-1">Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />

        <label className="block font-medium mb-1">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        >
          <option value="complaint">Complaint</option>
          <option value="suggestion">Suggestion</option>
          <option value="idea">Idea</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          Submit Your Complaint/Suggestion
        </button>
      </form>
    </div>
  );
};

export default PostForm;
