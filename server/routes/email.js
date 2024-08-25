const express = require('express');
const router = express.Router();
const { handleVerifyEmail, handleSendVerification } = require('../controllers/account/security');

router.route('/')
	.get(handleVerifyEmail);

router.route('/sendVerification')
	.post(handleSendVerification);

module.exports = router;