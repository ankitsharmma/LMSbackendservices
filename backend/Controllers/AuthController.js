const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create a new user
    const user = new UserModel({
      name,
      email,
      phoneNumber,
      address,
      password, // store as plain text
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        password: user.password, // plain text shown here
      },
    });
  } catch (err) {
    console.error("❌ signup error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password (plain text)
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        password: user.password,
      },
    });
  } catch (err) {
    console.error("❌ login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getuser = async (req, res) => {   
    try {
        const { name, email, phoneNumber, address } = req.query;

        // Build dynamic filter
        const filter = {};
        if (name) filter.name = name.trim();
        if (email) filter.email = email.trim().toLowerCase();
        if (phoneNumber) filter.phoneNumber = phoneNumber.trim();
        if (address) filter.address = address.trim();

        // Query database and INCLUDE password (bcrypt hash)
        const users = await UserModel.find(filter);

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found matching criteria"
            });
        }

        res.status(200).json({
            success: true,
            message: "User(s) fetched successfully",
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const updateUser = async (req, res) => {
  try {
    const { email, name, phoneNumber, address, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to update user",
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.password = password || user.password; // 🚨 hash password if needed

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("❌ updateUser error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required to delete user",
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete user
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        console.error("❌ deleteUser error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




    



module.exports = {
    signup,
    login,
    getuser,
    updateUser,
    deleteUser
};
