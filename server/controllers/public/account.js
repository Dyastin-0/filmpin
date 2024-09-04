const api = require('../../helpers/tmdbApi');
const Users = require('../../models/user');

const handleGetAccount = async (req, res) => {
	const { username } = req.query;

	if (!username) return res.status(400).json({ message: 'Missing username.' });

	try {
		const user = await Users.findOne({ username });

		if (!user) return res.status(404).json({ message: 'User not found.' });

		const { password, verificationToken, recoveryToken, __v, refreshToken, ...userData } = user.toJSON();
		res.json({
			user: userData
		});
	} catch (error) {
		console.error('Failed to get public account.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGetAccount
}