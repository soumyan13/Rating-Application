const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/:storeId/ratings', protect, authorize('STORE_OWNER'), ownerController.getStoreRatings);
router.get('/:storeId/average', protect, authorize('STORE_OWNER'), ownerController.getStoreAverage);

module.exports = router;
