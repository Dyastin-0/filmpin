const Users = require('../../models/user');
const { uploadImage } = require('../../helpers/cloudinaryApi');

/**
 * Sets the backdrop image path for a user.
 * @param {Object} req - The request object.
 * @param {string} req.query.user_id - The user ID from the request query.
 * @param {string} req.query.backdrop_path - The new backdrop image path.
 * @param {string} req.id - The authenticated user's ID from the request.
 * @param {Object} res - The response object.
 * @returns {Object} JSON containing the updated backdropPath.
 * @throws {Error} If user is not found or an internal server error occurs, returns appropriate status codes.
 */
const handleSetBackdrop = async (req, res) => {
	const { user_id, backdrop_path } = req.query;
	const { id } = req;

	if (!user_id) return res.status(400).json({ message: 'Missing ID.' });
	if (user_id !== id) return res.status(400).json({ message: 'Invalid ID.' });

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

/**
 * Sets the profile image for a user by uploading it to Cloudinary.
 * @param {Object} req - The request object.
 * @param {string} req.query.user_id - The user ID from the request query.
 * @param {string} req.id - The authenticated user's ID from the request.
 * @param {Object} req.file - The image file uploaded by the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON containing the result from Cloudinary (including the image URL).
 * @throws {Error} If user is not found, file is missing, or an internal server error occurs, returns appropriate status codes.
 */
const handleSetProfile = async (req, res) => {
	const { user_id } = req.query;
	const { id } = req;
	const file = req.file;

	if (!user_id) return res.status(400).json({ message: 'Missing ID.' });
	if (user_id !== id) return res.status(400).json({ message: 'Invalid ID.' });
	if (!file) return res.status(400).json({ message: 'Missing file.' });

	try {
		const publicId = `${id}-profile`;
		const result = await uploadImage(file.buffer, publicId);

		const user = await Users.findOne({ _id: id });
		if (!user) return res.status(404).json({ message: 'User not found.' });

		const profileURL = result.secure_url;
		await Users.updateOne({ _id: id }, { $set: { profileImageURL: profileURL } });

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
