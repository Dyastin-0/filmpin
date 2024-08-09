const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const { handleGetCategory, handleGetDetails } = require('../../controllers/api/movies');

router.route('/list/:category/:page')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetCategory);

router.route('/details/:movie_id')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetDetails);

module.exports = router;