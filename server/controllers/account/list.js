const Lists = require('../../models/list');
const Users = require('../../models/user');

const handleCreateList = async (req, res) => {
	const { id } = req;
	const { name, list, type } = req.body.list;

	if (!name) return res.status(400).json({ message: 'Missing name.' });
	if (!list || list.length < 1) return res.status(400).json({ message: 'List is empty/null/undefined.' });
	if (!type) return res.status(400).json({ message: 'Missing type.' });

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

		res.json({ message: 'List sucessfully created.' });
	} catch (error) {
		console.error('Failed to create list.', error);
		res.sendStatus(500);
	}
}

const handleGeUsertLists = async (req, res) => {
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
	handleGeUsertLists,
	handleCreateList,
	handleGetList
}