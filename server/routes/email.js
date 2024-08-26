const express = require('express');
const router = express.Router();
const { 
	handleVerifyEmail,
	handleSendVerification,
	handleRecoverAccount
} = require('../controllers/account/security');

router.route('/')
	.get((_,res) => res.send(200))

router.route('/verify')
	.get(handleVerifyEmail);

router.route('/verify/sendVerification')
	.post(handleSendVerification);

router.route('/rocover')
	.get(handleRecoverAccount);

module.exports = router;