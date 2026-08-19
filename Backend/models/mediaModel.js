const pool = require("../config/db");

const MediaModel = {
    async create(userId) {
        const [result] = await pool.query(
            `INSERT INTO media (user_id)
             VALUES (?)`,
            [userId]
        );

        return this.findById(result.insertId);
    },

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM media
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    },

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

    async findItemById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM media_items
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    },

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