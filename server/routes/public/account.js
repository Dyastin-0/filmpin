const express = require('express');
const router = express.Router();
const {
	handleGetAccount
} = require('../../controllers/public/account');

router.route('/')
	.get(handleGetAccount);

module.exports = router;