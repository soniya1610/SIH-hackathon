const User = require("../models/userModel");
const validateuser = require("../utils/validateuser");


// =========================
// UPDATE USER PROFILE
// =========================
exports.patchUser = async (req, res) => {
    try {
        const phone = req.body.phone;

        // Validate user data
        const { error } = validateuser(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const {
            username,
            height,
            weight,
            Dob,
            gender,
            email
        } = req.body;

        // Update user in MySQL
        const user = await User.updateProfile(phone, {
            username,
            height,
            weight,
            Dob,
            gender,
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (err) {
        console.error("Update user error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =========================
// GET CURRENT USER
// =========================
exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user from MySQL
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (err) {
        console.error("Get user error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =========================
// GET USER BY ID
// =========================
exports.getUserbyId = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (err) {
        console.error("Get user by ID error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =========================
// GET ALL USERS
// =========================
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        const count = await User.count();

        return res.status(200).json({
            count,
            users
        });

    } catch (err) {
        console.error("Get users error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};