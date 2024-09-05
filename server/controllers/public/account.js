const api = require('../../helpers/tmdbApi');
const Users = require('../../models/user');

/**
 * Retrieves public account data for a given username.
 * @param {Object} req - The request object.
 * @param {string} req.query.username - The username of the user whose account is being fetched.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON object containing the user's public information.
 * @throws {Error} - Returns status 500 if an internal error occurs.
 */
const handleGetProfile = async (req, res) => {
	const { username } = req.query;

	if (!username) return res.status(400).json({ message: 'Missing username.' });

	try {
		const user = await Users.findOne({ username });

		if (!user) return res.status(404).json({ message: 'User not found.' });

		// Destructure and exclude sensitive or unnecessary fields from the response
		const { password, verificationToken, recoveryToken, __v, refreshToken, ...userData } = user.toJSON();
		
		// Return the public user data
		res.json({
			user: userData
		});
	} catch (error) {
		console.error('Failed to get public account.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGetProfile
}
