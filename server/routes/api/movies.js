const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const { handleGetCategory,
	handleGetDetails,
	handleGetCredits,
	handleSearch
} = require('../../controllers/api/movies');

router.route('/list/:category/:page')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetCategory);

router.route('/details/:movie_id')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetDetails);

router.route('/credits/:movide_id')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetCredits);

router.route('/search/:query')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleSearch);

module.exports = router;