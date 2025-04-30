
const {pool} = require('../config/db');

const Store = {
  async create(storeData) {
    const { name, email, address, owner_id } = storeData;
    const [result] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, email, address, owner_id]
    );
    return result.insertId;
  },

  async getAllStores() {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              (SELECT AVG(rating) FROM ratings WHERE store_id = s.id) AS averageRating
       FROM stores s`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM stores WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
};

module.exports = Store;
