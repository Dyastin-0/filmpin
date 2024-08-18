const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const { handleGetCategory,
	handleGetDetails,
	handleGetCredits,
	handleSearch,
	handleGetVideo,
	handleDiscover
} = require('../../controllers/api/movies');

const cacheService = require('express-api-cache');
const cache = cacheService.cache;


router.use(verifyRoles(userRoles.user, userRoles.admin));

router.route('/list/:category/:page')
	.get(cache('10 minutes'), handleGetCategory);

router.route('/details/:movie_id')
	.get(cache('10 minutes'), handleGetDetails);

router.route('/credits/:movide_id')
	.get(cache('10 minutes'), handleGetCredits);

router.route('/search/:query/:page')
	.get(cache('10 minutes'), handleSearch);

router.route('/videos/:movie_id')
	.get(cache('10 minutes'), handleGetVideo);

router.route('discover/:query')
	.get(cache('10 minutes'), handleDiscover)

module.exports = router;