const express = require('express');
const router = express.Router();
const {
	handleGeUserLists,
	handleCreateList,
	handleGetList
} = require('../../../controllers/account/list');

router.route('/:list_id')
	.get(handleGetList);

router.route('/')
	.get(handleGeUserLists)
	.post(handleCreateList);

module.exports = router;