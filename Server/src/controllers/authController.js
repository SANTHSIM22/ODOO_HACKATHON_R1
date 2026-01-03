const User = require("../models/User");

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name, username } = req.body;

      if (!email || !password || !name || !username) {
        return res.status(400).json({
          success: false,
          message: "Please provide name, username, email, and password",
        });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken",
        });
      }

      const newUser = await User.create({
        name,
        username,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: newUser.toJSON(),
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide username and password",
        });
      }

      const user = await User.findOne({ username: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  },

  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide username and password",
        });
      }

      // Check if admin credentials are set in environment
      if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        console.error("Admin credentials not configured in environment variables");
        return res.status(500).json({
          success: false,
          message: "Admin login is not configured",
        });
      }

      // Validate admin credentials
      if (
        email.toLowerCase() === process.env.ADMIN_USERNAME.toLowerCase() &&
        password === process.env.ADMIN_PASSWORD
      ) {
        res.status(200).json({
          success: true,
          message: "Admin login successful",
          user: {
            name: "Administrator",
            username: process.env.ADMIN_USERNAME,
            isAdmin: true,
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during admin login",
      });
    }
  },
};

module.exports = authController;
