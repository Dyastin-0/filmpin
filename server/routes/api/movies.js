const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const { handleGetCategory,
	handleGetDetails,
	handleGetCredits,
	handleSearch,
	handleGetVideo
} = require('../../controllers/api/movies');

const cacheService = require('express-api-cache');
const cache = cacheService.cache;

router.route('/list/:category/:page')
	.get(verifyRoles(userRoles.user, userRoles.admin), cache('10 minutes'), handleGetCategory);

router.route('/details/:movie_id')
	.get(verifyRoles(userRoles.user, userRoles.admin), cache('10 minutes'), handleGetDetails);

router.route('/credits/:movide_id')
	.get(verifyRoles(userRoles.user, userRoles.admin), cache('10 minutes'), handleGetCredits);

router.route('/search/:query')
	.get(verifyRoles(userRoles.user, userRoles.admin), cache('10 minutes'), handleSearch);

router.route('/videos/:movie_id')
	.get(verifyRoles(userRoles.user, userRoles.admin), cache('10 minutes'), handleGetVideo);

module.exports = router;