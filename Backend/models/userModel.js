const pool = require("../config/db");

const UserModel = {

    // Find user by phone
    async findByPhone(phone) {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE phone = ?",
            [phone]
        );

        return rows[0] || null;
    },

    // Find user by ID
    async findById(id) {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        return rows[0] || null;
    },

    // Create new user
    async create(phone) {
        const [result] = await pool.query(
            `INSERT INTO users (phone)
             VALUES (?)`,
            [phone]
        );

        return this.findById(result.insertId);
    },

    // Mark phone as verified
    async verifyPhone(phone) {
        const [result] = await pool.query(
            `UPDATE users
             SET is_phone_verified = TRUE
             WHERE phone = ?`,
            [phone]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findByPhone(phone);
    },

    // Update user profile
    async updateProfile(phone, data) {
        const {
            username,
            height,
            weight,
            Dob,
            gender,
            email
        } = data;

        const [result] = await pool.query(
            `UPDATE users
             SET username = ?,
                 height = ?,
                 weight = ?,
                 dob = ?,
                 gender = ?,
                 email = ?
             WHERE phone = ?`,
            [
                username,
                height,
                weight,
                Dob,
                gender,
                email,
                phone
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findByPhone(phone);
    },

    // Get all users
    async findAll() {
        const [rows] = await pool.query(
            "SELECT * FROM users"
        );

        return rows;
    },

    // Count users
    async count() {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM users"
        );

        return rows[0].count;
    }
};

module.exports = UserModel;