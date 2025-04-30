const { User, Store, Rating } = require("../models");

exports.dashboard = async (req, res, next) => {
  try {
    const [userCount] = await pool.query(
      `SELECT COUNT(*) AS totalUsers FROM users`
    );
    const [storeCount] = await pool.query(
      `SELECT COUNT(*) AS totalStores FROM stores`
    );
    const [ratingCount] = await pool.query(
      `SELECT COUNT(*) AS totalRatings FROM ratings`
    );

    res.status(200).json({
      users: userCount[0].totalUsers,
      stores: storeCount[0].totalStores,
      ratings: ratingCount[0].totalRatings,
    });
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (role === "ADMIN" || role === "STORE-OWNER" || role === "USER") {
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized." });
      }
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Permission denied." });
      }
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({ message: "User added successfully.", userId });
  } catch (error) {
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.listStores = async (req, res, next) => {
  try {
    const stores = await Store.getAllStores();
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};
