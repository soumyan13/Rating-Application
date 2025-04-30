const { Rating } = require('../models');

exports.getStoreRatings = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;

    const ratings = await Rating.getRatingsByStoreId(storeId);

    res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

exports.getStoreAverage = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;

    const average = await Rating.getAverageRating(storeId);

    res.status(200).json({ averageRating: average });
  } catch (error) {
    next(error);
  }
};
