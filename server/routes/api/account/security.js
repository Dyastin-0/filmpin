const express = require("express");
const router = express.Router();
const {
  handleVerifyEmail,
  handleSendVerification,
  handleRecoverAccount,
  handleSendRecovery,
  handleSendPasswordUpdate,
  handleUpdatePassword,
} = require("../../../controllers/api/account/security");

router.route("/").get((_, res) => res.send(200));
router.route("/verify").post(handleVerifyEmail);
router.route("/verify/sendVerification").post(handleSendVerification);
router.route("/recover").post(handleRecoverAccount);
router.route("/recover/sendRecovery").post(handleSendRecovery);
router.route("/password/sendReset").post(handleSendPasswordUpdate);
router.route("/password").post(handleUpdatePassword);

module.exports = router;
