const { Store } = require("../models");
const { pool } = require("../config/db");

exports.listStores = async (req, res, next) => {
  try {
    const stores = await Store.getAllStores();
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};

exports.searchStores = async (req, res, next) => {
  try {
    const { query } = req.query;
    const [stores] = await pool.query(
      `SELECT s.id, s.name, s.address, AVG(r.rating) as averageRating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.name LIKE ? OR s.address LIKE ?
       GROUP BY s.id`,
      [`%${query}%`, `%${query}%`]
    );

    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};
