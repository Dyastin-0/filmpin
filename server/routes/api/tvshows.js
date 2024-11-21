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
  handleGetSeason,
  handleGetEpisode,
  handleGetSeasonVideo,
  handleGetEpisodeVideo,
} = require("../../controllers/api/tvshows");

const cacheService = require("express-api-cache");
const cache = cacheService.cache;

router.use(verifyRoles(userRoles.user, userRoles.admin));

router.route("/list").get(cache("10 minutes"), handleGetCategory);
router.route("/discover").get(cache("10 minutes"), handleDiscover);
router.route("/search").get(cache("10 minutes"), handleSearch);
router.route("/:show_id/videos").get(cache("10 minutes"), handleGetVideo);
router
  .route("/:show_id/:season_number")
  .get(cache("10 minutes"), handleGetSeason);
router.route("/:show_id").get(cache("10 minutes"), handleGetDetails);
router.route("/:show_id/credits").get(cache("10 minutes"), handleGetCredits);
router
  .route("/:show_id/:season_number/videos")
  .get(cache("10 minutes"), handleGetSeasonVideo);
router
  .route("/:show_id/:season_number/:episode_number/videos")
  .get(cache("10 minutes"), handleGetEpisodeVideo);
router
  .route("/:show_id/:season_number/:episode_number")
  .get(cache("10 minutes"), handleGetEpisode);

module.exports = router;
