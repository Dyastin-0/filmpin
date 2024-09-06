const express = require('express');
const router = express.Router();
const {
	handleGetList,
	handleCreateList
} = require('../../../controllers/account/list');

router.route('/')
	.post(handleCreateList);

router.route('/')
	.get(handleGetList);

module.exports = router;