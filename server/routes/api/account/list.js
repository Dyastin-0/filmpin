const express = require('express');
const router = express.Router();
const {
	handleGeUsertLists,
	handleCreateList,
	handleGetList
} = require('../../../controllers/account/list');

router.route('/:list_id')
	.get(handleGetList);

router.route('/')
	.get(handleGeUsertLists)
	.post(handleCreateList);

module.exports = router;