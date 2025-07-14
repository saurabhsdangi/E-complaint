import React, { useEffect, useState } from "react";
import axios from "../axios"; // adjust path accordingly


const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  const fetchUserPosts = async () => {
  try {
    console.log("Fetching posts for username:", user.username);
    const res = await axios.get(`http://localhost:5000/posts/user/${user.username}`);
    console.log("Fetched posts:", res.data); // ✅ Safe now
    setPosts(res.data);
    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
};


    if (user?.username) fetchUserPosts();
  }, [user]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading your posts...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Welcome, {user.username} 👋
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">You haven't submitted any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-indigo-700">{post.title}</h2>
              <p className="text-gray-700 mt-2">{post.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                <p><strong>📍 Location:</strong> {post.location}</p>
                <p><strong>📅 Posted:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                <p><strong>👍 Upvotes:</strong> {post.upvotes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
