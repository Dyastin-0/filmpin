const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const {
	handleSetBackdrop
} = require('../../controllers/account/details');

router.route('/set-backdrop')
	.post(verifyRoles(userRoles.admin, userRoles.user), handleSetBackdrop);

module.exports = router;