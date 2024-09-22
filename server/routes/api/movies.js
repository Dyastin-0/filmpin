const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middlewares/verifyRoles");
const userRoles = require("../../models/roleList");
const {
  handleGetCategory,
  handleGetDetails,
  handleGetCredits,
  handleSearch,
  handleGetVideo,
  handleDiscover,
  handleGetWatchProvider,
  handlePostReview,
  handleGetReview,
} = require("../../controllers/api/movies");

const cacheService = require("express-api-cache");
const cache = cacheService.cache;

router.use(verifyRoles(userRoles.user, userRoles.admin));

router.route("/list").get(cache("10 minutes"), handleGetCategory);

router.route("/details").get(cache("10 minutes"), handleGetDetails);

router.route("/credits").get(cache("10 minutes"), handleGetCredits);

router.route("/search").get(cache("10 minutes"), handleSearch);

router.route("/videos").get(cache("10 minutes"), handleGetVideo);

router.route("/discover").get(cache("10 minutes"), handleDiscover);

router
  .route("/watch-provider")
  .get(cache("10 minutes"), handleGetWatchProvider);

router
  .route("/reviews")
  .post(cache("10 minutes"), handlePostReview)
  .get(handleGetReview);

module.exports = router;
