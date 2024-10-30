const express = require("express");
const router = express.Router();

const { handleRecommend } = require("../../../controllers/api/ai/gemini");

router.route("/", (res, _) => res.send("Filmpin AI."));

router.route("/movie/recommend").post(handleRecommend);

module.exports = router;
