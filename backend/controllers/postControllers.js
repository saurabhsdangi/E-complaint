// backend/controllers/postController.js
const Post = require('../models/post');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { title, description, category, location, name } = req.body;

  if (!title || !description || !category || !location || !name?.trim()) {
    return res.status(400).json({ error: 'All fields including username are required' });
  }

  try {
    const newPost = new Post({
      title,
      description,
      category,
      location,
      name: name.trim(), // Ensure no leading/trailing spaces
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upvote a post
exports.upvotePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const posts = await Post.find({ name: username }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
