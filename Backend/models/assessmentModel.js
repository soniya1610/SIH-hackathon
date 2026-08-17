const pool = require("../config/db");

const AssessmentModel = {

    // Create assessment
    async create(userId, assessmentName, assessmentVerification, repCount) {

        const [result] = await pool.query(
            `INSERT INTO assessments
            (user_id, assessment_name, assessment_verification, rep_count)
            VALUES (?, ?, ?, ?)`,
            [
                userId,
                assessmentName,
                assessmentVerification,
                repCount
            ]
        );

        return this.findById(result.insertId);
    },


    // Find assessment by ID
    async findById(id) {

        const [rows] = await pool.query(
            `SELECT * FROM assessments
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    },


    // Find all assessments of a user
    async findByUserId(userId) {

        const [rows] = await pool.query(
            `SELECT * FROM assessments
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        return rows;
    },


    // Update assessment
    async update(id, data) {

        const {
            assessmentName,
            assessmentVerification,
            repCount
        } = data;

        const [result] = await pool.query(
            `UPDATE assessments
             SET assessment_name = ?,
                 assessment_verification = ?,
                 rep_count = ?
             WHERE id = ?`,
            [
                assessmentName,
                assessmentVerification,
                repCount,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

};

module.exports = AssessmentModel;