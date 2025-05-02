const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validatePassword } = require("../utils/validatePassword");
const generateToken = require("../utils/generateToken");
const { pool } = require("../config/db");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password does not meet security criteria." });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: "USER",
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (user.role !== role) {
      return res
        .status(400)
        .json({ message: `You are not registered as a ${role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect." });
    }

    if (!validatePassword(newPassword)) {
      return res
        .status(400)
        .json({ message: "New password does not meet security criteria." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?`,
      [hashedPassword, req.user.id]
    );

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
