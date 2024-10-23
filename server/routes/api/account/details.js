const express = require("express");
const router = express.Router();
const upload = require("../../../middlewares/multer");
const verifyRoles = require("../../../middlewares/verifyRoles");
const userRoles = require("../../../models/roleList");
const {
  handleSetBackdrop,
  handleSetProfile,
} = require("../../../controllers/api/account/details");

router
  .route("/set-backdrop")
  .post(verifyRoles(userRoles.admin, userRoles.user), handleSetBackdrop);

router
  .route("/set-profile")
  .post(
    verifyRoles(userRoles.admin, userRoles.user),
    upload.single("imageFile"),
    handleSetProfile
  );

router.route("/list", require("./list"));

module.exports = router;