const pool = require("../config/db");

const AddressModel = {

    // Create address
    async create(userId, data) {
        const {
            State,
            District,
            AddressLine,
            PinCode
        } = data;

        const [result] = await pool.query(
            `INSERT INTO addresses
            (user_id, state, district, address_line, pin_code)
            VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                State,
                District,
                AddressLine,
                PinCode
            ]
        );

        return this.findById(result.insertId);
    },


    // Find address by ID
    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM addresses WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    },


    // Find address by user ID
    async findByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT * FROM addresses WHERE user_id = ?`,
            [userId]
        );

        return rows;
    },


    // Update address
    async update(userId, data) {
        const {
            State,
            District,
            AddressLine,
            PinCode
        } = data;

        const [result] = await pool.query(
            `UPDATE addresses
             SET state = ?,
                 district = ?,
                 address_line = ?,
                 pin_code = ?
             WHERE user_id = ?`,
            [
                State,
                District,
                AddressLine,
                PinCode,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findByUserId(userId);
    },


    // Delete address
    async delete(userId) {
        const [result] = await pool.query(
            `DELETE FROM addresses WHERE user_id = ?`,
            [userId]
        );

        return result.affectedRows > 0;
    }

};

module.exports = AddressModel;