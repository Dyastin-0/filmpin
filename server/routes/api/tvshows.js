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

router.use(verifyRoles(userRoles.user, userRoles.admin));

router.route("/list").get(handleGetCategory);
router.route("/discover").get(handleDiscover);
router.route("/search").get(handleSearch);
router.route("/:show_id/videos").get(handleGetVideo);
router
  .route("/:show_id/:season_number")
  .get(handleGetSeason);
router.route("/:show_id/credits").get(handleGetCredits);
router.route("/:show_id").get(handleGetDetails);
router
  .route("/:show_id/:season_number/videos")
  .get(handleGetSeasonVideo);
router
  .route("/:show_id/:season_number/:episode_number/videos")
  .get(handleGetEpisodeVideo);
router
  .route("/:show_id/:season_number/:episode_number")
  .get(handleGetEpisode);

module.exports = router;
