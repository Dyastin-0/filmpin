const express = require('express');
const router = express.Router();
const { handleGetPublicBackdrops } = require('../../controllers/public/backdrops');

router.route('/')
	.get(handleGetPublicBackdrops);

module.exports = router;