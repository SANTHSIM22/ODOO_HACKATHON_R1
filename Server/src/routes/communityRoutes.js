const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");

// Get all community posts
router.get("/posts", communityController.getAllPosts);

// Create a new community post
router.post("/posts", communityController.createPost);

// Get posts by user
router.get("/posts/user/:userId", communityController.getUserPosts);

// Update a post
router.put("/posts/:postId", communityController.updatePost);

// Delete a post
router.delete("/posts/:postId", communityController.deletePost);

module.exports = router;
