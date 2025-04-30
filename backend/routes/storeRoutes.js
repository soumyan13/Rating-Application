const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", storeController.listStores);
router.get("/search", protect, storeController.searchStores);

module.exports = router;
