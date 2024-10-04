const express = require("express");
const router = express.Router();

const cacheService = require("express-api-cache");

const {
  handlePostReview,
  handleGetReview,
  handleLike,
  handleGetUserReviews,
} = require("../../controllers/api/reviews");

router.route("/").post(handlePostReview).get(handleGetReview);

router.route("/:user_id").get(handleGetUserReviews);

router.route("/like").post(handleLike);

module.exports = router;
