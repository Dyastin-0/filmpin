const Users = require('../models/user');
const jwt = require('jsonwebtoken');

const handleRefreshAccessToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

	const user = await Users.findOne({ refreshToken });
	if (!user) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (error, decoded) => {
				if (error) return res.sendStatus(403);
				console.log(decoded);
				const hackedUser = await Users.findOne({ email: decoded.email });
				await Users.updateOne({ email: hackedUser.email }, { $set: { refreshToken: [] } });
			}
		);
		return res.sendStatus(403);
	}

	let newRefreshTokens = user.refreshToken.filter(rt => rt !== refreshToken);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (error, decoded) => {
			if (error) {
				await Users.updateOne({ email: user.email }, { $set: { refreshToken: [...newRefreshTokens] } });
			}
			if (error || user.email !== decoded.email) return res.sendStatus(403);
			console.log(user._id);
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
			await Users.updateOne({ email: user.email }, { $set: { refreshToken: [...newRefreshTokens, newRefreshToken] } });
			res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
			const { password, verificationToken, recoveryToken, __v, refreshToken, ...userData } = user.toJSON();
			res.json({
				accessToken,
				user: userData
			});
		}
	);
}

module.exports = handleRefreshAccessToken;