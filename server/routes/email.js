const express = require("express");
const router = express.Router();
const {
  handleVerifyEmail,
  handleSendVerification,
  handleRecoverAccount,
  handleSendRecovery,
} = require("../controllers/api/account/security");

router.route("/").get((_, res) => res.send(200));

router.route("/verify").post(handleVerifyEmail);

router.route("/verify/sendVerification").post(handleSendVerification);

router.route("/recover").post(handleRecoverAccount);

router.route("/recover/sendRecovery").post(handleSendRecovery);

module.exports = router;
