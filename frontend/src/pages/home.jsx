import React, { useEffect, useState } from "react";
import axios from "../axios"; // adjust path accordingly
import { Link, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  // const username = localStorage.getItem("username");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpvote = async (id) => {
    const upvoted = JSON.parse(localStorage.getItem("upvotedPosts")) || [];

    if (upvoted.includes(id)) {
      alert("You’ve already upvoted this post.");
      return;
    }

    try {
      await axios.put(`/posts/upvote/${id}`);
      localStorage.setItem("upvotedPosts", JSON.stringify([...upvoted, id]));
      fetchPosts();
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(lowerSearch) ||
      post.description.toLowerCase().includes(lowerSearch) ||
      post.location.toLowerCase().includes(lowerSearch);

    const matchesCategory = category
      ? post.category?.toLowerCase() === category.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-blue-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 🔐 Header and Auth Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            🇮🇳 Complaint & Improvement Portal
          </h1>
          {user ?(
  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
    <span className="text-sm text-gray-700">
      👋 Hello, <strong>{user.username || "User"}</strong>
    </span>
    <button
      onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}
      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
    >
      Logout
    </button>
    <Link
      to="/dashboard"
      className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 text-sm text-center"
    >
      My Dashboard
    </Link>
  </div>
) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-white border border-indigo-300 text-indigo-600 px-4 py-1 rounded hover:bg-indigo-100 text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 text-sm"
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* 🔍 Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or location..."
            className="w-full md:w-2/3 px-4 py-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-indigo-300 rounded shadow-sm text-gray-700"
          >
            <option value="">All Categories</option>
            <option value="complaint">Complaint</option>
            <option value="suggestion">Suggestion</option>
            <option value="idea">Idea</option>
          </select>
        </div>

        {/* 📝 Post Form */}
        {user ? (
          <PostForm onPostSuccess={fetchPosts} />
        ) : (
          <div className="bg-white p-4 rounded-lg shadow mb-6 text-center text-gray-600">
            <p className="text-lg">
              ✋ Please{" "}
              <Link to="/login" className="text-indigo-600 underline">
                login
              </Link>{" "}
              or{" "}
              <Link to="/signup" className="text-indigo-600 underline">
                signup
              </Link>{" "}
              to submit a complaint, idea, or suggestion.
            </p>
          </div>
        )}

        {/* 📋 Posts */}
        <h2 className="text-2xl font-semibold text-indigo-800 mt-10 mb-4">
          Latest Posts
        </h2>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-indigo-100 rounded-xl shadow-sm p-5 transition hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-indigo-700">{post.title}</h3>
                <p className="text-gray-700 mt-2">{post.description}</p>
                <div className="text-sm text-gray-600 mt-3 flex flex-wrap gap-4">
                  <span>
                    📍 <strong>Location:</strong> {post.location}
                  </span>
                  <span>
                    📂 <strong>Category:</strong> {post.category}
                  </span>
                  <span>
                    👤 <strong>By:</strong> {post.name || "Anonymous"}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleUpvote(post._id)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    👍 Upvote
                  </button>
                  <span className="text-indigo-700 font-medium">
                    {post.upvotes} upvotes
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
