const express = require("express");
const router = express.Router();
const passport = require("../middlewares/passport");
const { handleAuth, handleGoogleAuth } = require("../controllers/auth");
const handleRefreshAccessToken = require("../controllers/refreshAccessToken");
const handleSignup = require("../controllers/signup");
const handleSignout = require("../controllers/signout");
const handleRoot = require("../controllers/root");

router.get("/", handleRoot);
router.get("/refresh-access-token", handleRefreshAccessToken);
router.post("/sign-out", handleSignout);
router.post("/sign-up", handleSignup);
router.post("/sign-in", handleAuth);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.BASE_CLIENT_URL}/sign-in?gae=true`,
  }),
  handleGoogleAuth
);

module.exports = router;
