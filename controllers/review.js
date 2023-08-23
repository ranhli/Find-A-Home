const Bnb = require("../models/bnb");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const bnb = await Bnb.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  bnb.reviews.push(review);
  await review.save();
  await bnb.save();
  req.flash("success", "Successfully created a new review");
  res.redirect(`/homes/${bnb._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Bnb.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Successfully deleted a review");
  res.redirect(`/homes/${id}`);
};
