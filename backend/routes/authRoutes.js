const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer(); 

router.post("/signup", upload.none(), authController.signup);
router.post("/login", authController.login);
router.patch("/update-password", protect, authController.updatePassword);

module.exports = router;
