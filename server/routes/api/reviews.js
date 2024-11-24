const express = require("express");
const router = express.Router();

const {
  handlePostReview,
  handleGetReview,
  handleDeleteReview,
  handleLike,
  handleGetUserReviews,
  handleSearchReviews,
} = require("../../controllers/api/reviews");

router.route("/like").post(handleLike);
router.route("/search").get(handleSearchReviews);
router
  .route("/")
  .post(handlePostReview)
  .get(handleGetReview)
  .delete(handleDeleteReview);
router.route("/:user_id").get(handleGetUserReviews);

module.exports = router;
