const Users = require('../../models/user');

const handleSetBackdrop = async (req, res) => {
	const { user_id, backdrop_path } = req.query;
	const { id } = req;

	if (!user_id) return res.status(400).json({ message: 'Missing ID.' });
	console.log(user_id, id);

	if (user_id !== id) return res.status(400).json({ message: `Invalid ID.` });


	try {
		const user = await Users.findOne({ _id: id });
		if (!user) return res.status(404).json({ message: 'User not found.' });
		await Users.updateOne({ _id: id }, { $set: { backdropPath: backdrop_path } });
		res.json({ backdropPath: backdrop_path});
	} catch (error) {
		console.error('Failed to set backdrop.', error);
	}
}

module.exports = {
	handleSetBackdrop
}