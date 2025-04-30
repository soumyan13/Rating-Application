const { pool } = require('../config/db');

const User = {
  async create(userData) {
    const { name, email, password, address, role } = userData;
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, address, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, password, address, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async getAllUsers() {
    const [rows] = await pool.query(
      `SELECT id, name, email, address, role FROM users`
    );
    return rows;
  }
};

module.exports = User;
