const express = require("express");
const router = express.Router();
const upload = require("../../../middlewares/multer");
const verifyRoles = require("../../../middlewares/verifyRoles");
const userRoles = require("../../../models/roleList");
const {
  handleSetProfile,
  handleDeleteProfile,
  handleUpdateUsername,
  handleDelete,
} = require("../../../controllers/api/account/details");

router
  .route("/")
  .delete(verifyRoles(userRoles.admin, userRoles.user), handleDelete);

router
  .route("/profile-photo")
  .post(
    verifyRoles(userRoles.admin, userRoles.user),
    upload.single("imageFile"),
    handleSetProfile
  )
  .delete(verifyRoles(userRoles.admin, userRoles.user), handleDeleteProfile);

router.route("/list", require("./list"));

router
  .route("/username")
  .patch(verifyRoles(userRoles.admin, userRoles.user), handleUpdateUsername);

module.exports = router;
