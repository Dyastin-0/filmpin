const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const { compare } = require('../helpers/hash');

/**
 * Handles user authentication by validating email and password, and issuing JWT access and refresh tokens.
 * - If the user's email and password match, generates and returns access and refresh tokens.
 * - Updates the user's refresh token in the database and sets a cookie with the new refresh token.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing email and password.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {Object} req.cookies - The cookies attached to the request.
 * @param {string} [req.cookies.jwt] - The refresh token stored in cookies (if available).
 * @param {Object} res - The response object.
 * 
 * @returns {Object|void} 
 * - On success, sends a JSON response containing:
 *    - `accessToken` {string} - The JWT access token.
 *    - `user` {Object} - The authenticated user's data excluding sensitive fields.
 * - On failure, sends an appropriate error status and JSON message.
 *    - {400} - Missing or invalid input.
 *    - {403} - Account not verified.
 *    - {404} - Account not found.
 *    - {401} - Invalid credentials.
 * 
 * @throws {Error} - If an internal server error occurs during authentication.
 */
const handleAuth = async (req, res) => {
	const cookies = req.cookies;
	const { email, password } = req.body;

	if (!email) return res.status(400).json({ error: 'Bad request. Missing input: Email.' });
	if (!password || password.length < 6) return res.status(400).json({ message: 'Bad request. Invalid input: Password.' });

	const user = await Users.findOne({ email });
	if (!user) return res.status(404).json({ message: 'Account not found.' });
	if (!user.verified) return res.status(403).json({ message: 'Verify your account.' });

	const matched = await compare(password, user.password);
	if (matched) {
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: user.username,
					email: user.email,
					roles: user.roles,
					id: user._id
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		const newRefreshToken = jwt.sign(
			{ username: user.username, email: user.email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		let newRefreshTokens = !cookies?.jwt ?
			user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt);

		if (cookies?.jwt) {
			const refreshToken = cookies.jwt;
			const foundToken = await Users.findOne({ refreshToken });

			if (!foundToken) {
				newRefreshTokens = [];
			}
			res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		}

		await Users.updateOne({ email: user.email }, { $set: { refreshToken: [...newRefreshTokens, newRefreshToken] } });

		res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
		const { password, verificationToken, recoveryToken, __v, refreshToken, ...userData } = user.toJSON();
		res.json({
			accessToken,
			user: userData
		});
	} else {
		return res.status(401).json({ message: 'Invalid credentials.' });
	}
};

module.exports = {
	handleAuth
};
