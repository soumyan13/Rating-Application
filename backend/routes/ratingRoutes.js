const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/submit', protect, ratingController.submitRating);

module.exports = router;
