const Lists = require('../../models/list');
const Users = require('../../models/user');
const listTypes = require('../../models/listTypes');

/**
 * Creates a new list for a user.
 * @param {Object} req - The request object.
 * @param {string} req.id - The ID of the user.
 * @param {Object} req.body.list - The list object from the request body.
 * @param {string} req.body.list.name - The name of the list.
 * @param {Array} req.body.list.list - The items in the list.
 * @param {string} req.body.list.type - The type of the list.
 * @param {Object} res - The response object.
* @returns {Object} Success message.
 */
const handleCreateList = async (req, res) => {
	const { id } = req;
	const { name, list, type } = req.body.list;

	if (!name) return res.status(400).json({ message: 'Missing name.' });
	if (!list || list.length < 1) return res.status(400).json({ message: 'List is empty/null/undefined.' });
	if (!type || listTypes[type] === undefined ) return res.status(400).json({ message: 'Missing/Invalid type.' });

	try {
		const user = await Users.findOne({ _id: id });
		if (!user) return res.status(404).json({ message: 'User not found.' });

		const newList = await Lists.create({
			owner: id,
			name: name,
			list: list,
			type: type
		});

		const newUserLists = user.lists ? user.lists.concat(newList._id) : [newList._id];
		await Users.updateOne({ _id: id }, { $set: { lists: newUserLists } });

		res.json({ message: 'List successfully created.' });
	} catch (error) {
		console.error('Failed to create list.', error);
		res.sendStatus(500);
	}
}

/**
 * Fetches the lists for a specific user.
 * @param {Object} req - The request object.
 * @param {string} req.id - The ID of the user.
 * @param {Object} res - The response object.
* @returns {Object} JSON object containing the specified user's lists.
 */
const handleGeUserLists = async (req, res) => {
	const { id } = req;

	if (!id) return res.status(400).json({ message: 'Missing ID.' });

	try {
		const response = await Lists.find({ owner: id });
		res.json(response);
	} catch (error) {
		console.error('Failed to fetch user lists.', error);
		res.sendStatus(500);
	}
}

/**
 * Fetches a specific list by its ID.
 * @param {Object} req - The request object.
 * @param {string} req.params.list_id - The ID of the list.
 * @param {Object} res - The response object.
* @returns {Object} JSON object containing the specified list.
 */
const handleGetList = async (req, res) => {
	const { list_id } = req.params;

	if (!list_id) return res.status(400).json({ message: 'Missing list ID.' });

	try {
		const response = await Lists.findOne({ _id: list_id });
		res.json(response);
	} catch (error) {
		console.error('Failed to fetch list.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGeUserLists,
	handleCreateList,
	handleGetList
}
