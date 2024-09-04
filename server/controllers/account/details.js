const Users = require('../../models/user');
const { uploadImage } = require('../../helpers/cloudinaryApi');

const handleSetBackdrop = async (req, res) => {
	const { user_id, backdrop_path } = req.query;
	const { id } = req;

	if (!user_id) return res.status(400).json({ message: 'Missing ID.' });
	if (user_id !== id) return res.status(400).json({ message: `Invalid ID.` });

	try {
		const user = await Users.findOne({ _id: id });
		if (!user) return res.status(404).json({ message: 'User not found.' });
		await Users.updateOne({ _id: id }, { $set: { backdropPath: backdrop_path } });
		res.json({ backdropPath: backdrop_path });
	} catch (error) {
		console.error('Failed to set backdrop.', error);
		res.sendStatus(500);
	}
}

const handleSetProfile = async (req, res) => {
	const { user_id } = req.query;
	const { id } = req;
	const file = req.file;

	if (!user_id) return res.status(400).json({ message: 'Missing ID.' });
	if (user_id !== id) return res.status(400).json({ message: `Invalid ID.` });
	if (!file) return res.status(400).json({ message: 'Missing file.' });

	try {
		const publicId = `${id}-profile`;
		const result = await uploadImage(file.buffer, publicId);

		const user = await Users.findOne({ _id: id });
		if (!user) res.status(404).json({ message: 'User not found.' });

		const profileURL = result.secure_url;
		await Users.updateOne({ _id: id }, {$set:{ profileImageURL: profileURL }});

		res.json(result);
	} catch (error) {
		console.error('Failed to set profile.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleSetBackdrop,
	handleSetProfile
}