const express = require('express');
const router = express.Router();
const { verifyJsonWebToken } = require('../../middlewares/verifyJsonWebToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const userRoles = require('../../models/roleList');
const handleGetUsers = require('../../controllers/api/users');

router.route('/')
	.get(verifyRoles(userRoles.user, userRoles.admin), handleGetUsers);

module.exports = router;