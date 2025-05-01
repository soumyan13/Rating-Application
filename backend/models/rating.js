const { pool } = require("../config/db");

const Rating = {
  async submitRating(userId, storeId, rating) {
    const [existing] = await pool.query(
      `SELECT * FROM ratings WHERE user_id = ? AND store_id = ?`,
      [userId, storeId]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE ratings SET rating = ?, updatedAt = NOW()
         WHERE user_id = ? AND store_id = ?`,
        [rating, userId, storeId]
      );
    } else {
      await pool.query(
        `INSERT INTO ratings (user_id, store_id, rating, createdAt, updatedAt)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [userId, storeId, rating]
      );
    }
  },

  async getRatingsByStoreId(storeId) {
    const [rows] = await pool.query(
      `SELECT r.id, r.rating, u.name as userName,u.email AS userEmail
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [storeId]
    );
    return rows;
  },

  async getAverageRating(storeId) {
    const [rows] = await pool.query(
      `SELECT AVG(rating) as average FROM ratings WHERE store_id = ?`,
      [storeId]
    );
    return rows[0]?.average || 0;
  },
};

module.exports = Rating;
