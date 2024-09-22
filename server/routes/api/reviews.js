const express = require("express");
const router = express.Router();

const cacheService = require("express-api-cache");
const cache = cacheService.cache;

const {
  handlePostReview,
  handleGetReview,
  handleLike,
} = require("../../controllers/api/reviews");

router
  .route("/")
  .post(cache("10 minutes"), handlePostReview)
  .get(handleGetReview);

router.route("/like").post(handleLike);

module.exports = router;
