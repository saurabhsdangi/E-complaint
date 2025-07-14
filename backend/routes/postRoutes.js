// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  upvotePost,
  getUserPosts
} = require('../controllers/postControllers');

// Routes
router.get('/', getAllPosts);
router.post('/', createPost); // No auth middleware
router.put('/upvote/:id', upvotePost);
router.get("/user/:username", getUserPosts); // controller should fetch posts by username

module.exports = router;
