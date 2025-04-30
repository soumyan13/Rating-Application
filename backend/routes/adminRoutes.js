const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, authorize('ADMIN'), adminController.dashboard);
router.post('/add-user', protect, authorize('ADMIN'), adminController.addUser);
router.get('/users', protect, authorize('ADMIN'), adminController.listUsers);
router.get('/stores', protect, authorize('ADMIN'), adminController.listStores);

module.exports = router;
