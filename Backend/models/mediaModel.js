const pool = require("../config/db");

const MediaModel = {

    // Create parent media record
    async create(userId) {

        const [result] = await pool.query(
            `INSERT INTO media (user_id)
             VALUES (?)`,
            [userId]
        );

        return this.findById(result.insertId);
    },


    // Find media by ID
    async findById(id) {

        const [rows] = await pool.query(
            `SELECT * FROM media
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    },


    // Add image/video to media_items
    async addItem(mediaId, data) {

        const {
            assessmentId,
            title,
            type,
            url,
            publicId
        } = data;

        const [result] = await pool.query(
            `INSERT INTO media_items
            (media_id, assessment_id, title, type, url, public_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                mediaId,
                assessmentId || null,
                title,
                type,
                url,
                publicId
            ]
        );

        return this.findItemById(result.insertId);
    },


    // Find media item
    async findItemById(id) {

        const [rows] = await pool.query(
            `SELECT * FROM media_items
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    },


    // Get media + all media items for a user
    async findByUserId(userId) {

        const [mediaRows] = await pool.query(
            `SELECT *
             FROM media
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        for (const media of mediaRows) {

            const [items] = await pool.query(
                `SELECT *
                 FROM media_items
                 WHERE media_id = ?
                 ORDER BY created_at DESC`,
                [media.id]
            );

            media.media = items;
        }

        return mediaRows;
    },


    // Get media by media ID with its items
    async findWithItems(mediaId) {

        const media = await this.findById(mediaId);

        if (!media) {
            return null;
        }

        const [items] = await pool.query(
            `SELECT *
             FROM media_items
             WHERE media_id = ?`,
            [mediaId]
        );

        media.media = items;

        return media;
    },


    // Delete media item
    async deleteItem(itemId) {

        const [result] = await pool.query(
            `DELETE FROM media_items
             WHERE id = ?`,
            [itemId]
        );

        return result.affectedRows > 0;
    }

};

module.exports = MediaModel;