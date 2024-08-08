const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const handleGetMovies = require('../../controllers/api/movies');

router.route('/top-rated')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetMovies);

module.exports = router;