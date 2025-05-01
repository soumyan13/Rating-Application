const { Rating } = require("../models");

exports.submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const ratingObject = await Rating.submitRating(
      req.user.id,
      storeId,
      rating
    );

    res
      .status(200)
      .json({
        message: "Rating submitted successfully.",
        rating:rating
      });
  } catch (error) {
    next(error);
  }
};

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
