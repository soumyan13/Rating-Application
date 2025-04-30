const { Rating } = require('../models');

exports.submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    await Rating.submitRating(req.user.id, storeId, rating);

    res.status(200).json({ message: 'Rating submitted successfully.' });
  } catch (error) {
    next(error);
  }
};
