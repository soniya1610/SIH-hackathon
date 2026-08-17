const validateAddress = require("../utils/validateaddress");
const Address = require("../models/addressModel");


// POST /address/me
exports.postMyAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate request
        const { error } = validateAddress(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        const {
            State,
            District,
            AddressLine,
            PinCode
        } = req.body;

        // Create address in MySQL
        const address = await Address.create(userId, {
            State,
            District,
            AddressLine,
            PinCode
        });

        return res.status(201).json({
            message: "Address added successfully",
            address
        });

    } catch (err) {
        console.error("Post address error:", err);

        return res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
};


// GET /address/me
exports.getMyAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get address from MySQL
        const addresses = await Address.findByUserId(userId);

        if (addresses.length === 0) {
            return res.status(404).json({
                error: "No address found"
            });
        }

        return res.status(200).json(addresses);

    } catch (err) {
        console.error("Get address error:", err);

        return res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
};


// PUT /address/me
exports.updateMyAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate request
        const { error } = validateAddress(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        // Update address in MySQL
        const updatedAddress = await Address.update(
            userId,
            req.body
        );

        if (!updatedAddress) {
            return res.status(404).json({
                error: "No address found"
            });
        }

        return res.status(200).json({
            message: "Address updated",
            updatedAddress
        });

    } catch (err) {
        console.error("Update address error:", err);

        return res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
};


// DELETE /address/me
exports.deleteMyAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete address from MySQL
        const deleted = await Address.delete(userId);

        if (!deleted) {
            return res.status(404).json({
                error: "No address found"
            });
        }

        return res.status(200).json({
            message: "Address deleted"
        });

    } catch (err) {
        console.error("Delete address error:", err);

        return res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
};