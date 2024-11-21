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
} = require("../../controllers/api/movies");

const cacheService = require("express-api-cache");
const cache = cacheService.cache;

router.use(verifyRoles(userRoles.user, userRoles.admin));

router.route("/list").get(cache("10 minutes"), handleGetCategory);
router.route("/search").get(cache("10 minutes"), handleSearch);
router.route("/discover").get(cache("10 minutes"), handleDiscover);

router.route("/:movie_id/credits").get(cache("10 minutes"), handleGetCredits);
router.route("/:movie_id/videos").get(cache("10 minutes"), handleGetVideo);
router.route("/:movie_id").get(cache("10 minutes"), handleGetDetails);

router
  .route("/watch-provider")
  .get(cache("10 minutes"), handleGetWatchProvider);

module.exports = router;
