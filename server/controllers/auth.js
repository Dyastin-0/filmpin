const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const { compare } = require('../helpers/hash');

const handleAuth = async (req, res) => {
	const cookies = req.cookies;
	const { email, password } = req.body;
	if (!email) return res.status(400).json({ error: 'Bad request. Missing input: Email.' });
	if (!password || password.length < 6) return res.status(400).json({ message: 'Bad request. Invalid input: Password.' });
	const user = await Users.findOne({ email });
	if (!user) return res.status(404).json({ message: 'Account not found.' });
	if (!user.verified) return res.status(403).json({message: 'Verify your account.'});
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
		res.json({
			accessToken,
			user: { username: user.username, email: user.email, roles: user.roles, backdropPath: user.backdropPath, id: user._id }
		});
	} else {
		return res.status(401).json({ message: 'Invalid credentials.' });
	}
};

module.exports = {
	handleAuth
}