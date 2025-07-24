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

router.use(verifyRoles(userRoles.user, userRoles.admin));

router.route("/list").get(handleGetCategory);
router.route("/search").get(handleSearch);
router.route("/discover").get(handleDiscover);

router.route("/:movie_id/credits").get(handleGetCredits);
router.route("/:movie_id/videos").get(handleGetVideo);
router.route("/:movie_id").get(handleGetDetails);

router
  .route("/watch-provider")
  .get(handleGetWatchProvider);

module.exports = router;
