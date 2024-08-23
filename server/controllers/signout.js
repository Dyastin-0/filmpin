const Users = require('../models/user');

const handleSignout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) return res.status(204);

	const refreshToken = cookies.jwt;
	const user = await Users.findOne({ refreshToken });

	if (!user) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}

	await Users.updateOne({ refreshToken }, { $set: { refreshToken: user.refreshToken.filter(rt => rt !== refreshToken) } });
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
}

module.exports = handleSignout;