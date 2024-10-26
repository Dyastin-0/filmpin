const express = require("express");
const router = express.Router();
const { handleAuth } = require("../controllers/auth");
const handleRefreshAccessToken = require("../controllers/refreshAccessToken");
const handleSignup = require("../controllers/signup");
const handleSignout = require("../controllers/signout");
const handleRoot = require("../controllers/root");

router.get("/", handleRoot);
router.get("/refresh-access-token", handleRefreshAccessToken);
router.post("/sign-out", handleSignout);
router.post("/sign-up", handleSignup);
router.post("/sign-in", handleAuth);

module.exports = router;
