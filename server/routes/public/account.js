const express = require('express');
const router = express.Router();
const {
	handleGetProfile
} = require('../../controllers/public/account');

router.route('/')
	.get(handleGetProfile);

module.exports = router;