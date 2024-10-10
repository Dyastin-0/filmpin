const express = require("express");
const router = express.Router();

const {
  handlePostReview,
  handleGetReview,
  handleLike,
  handleGetUserReviews,
  handleSearchReviews,
} = require("../../controllers/api/reviews");

router.route("/").post(handlePostReview).get(handleGetReview);
router.route("/:user_id").get(handleGetUserReviews);
router.route("/like").post(handleLike);
router.route("/search").get(handleSearchReviews);

module.exports = router;
