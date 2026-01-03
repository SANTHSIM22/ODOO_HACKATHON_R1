const CommunityPost = require("../models/CommunityPost");

const communityController = {
  // Get all community posts
  getAllPosts: async (req, res) => {
    try {
      const posts = await CommunityPost.find()
        .sort({ createdAt: -1 })
        .limit(100);

      res.status(200).json({
        success: true,
        posts: posts,
      });
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching community posts",
      });
    }
  },

  // Create a new community post
  createPost: async (req, res) => {
    try {
      const {
        userId,
        userName,
        userImage,
        placeName,
        location,
        description,
        imageUrl,
        tips,
      } = req.body;

      if (!userId || !userName || !placeName || !location || !description) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields",
        });
      }

      const newPost = await CommunityPost.create({
        userId,
        userName,
        userImage,
        placeName,
        location,
        description,
        imageUrl,
        tips,
      });

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(500).json({
        success: false,
        message: "Error creating community post",
      });
    }
  },

  // Get posts by user
  getUserPosts: async (req, res) => {
    try {
      const { userId } = req.params;

      const posts = await CommunityPost.find({ userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        posts: posts,
      });
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching user posts",
      });
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      const { postId } = req.params;

      const post = await CommunityPost.findByIdAndDelete(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting post",
      });
    }
  },
};

module.exports = communityController;
