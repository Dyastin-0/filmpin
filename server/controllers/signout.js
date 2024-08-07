const Users = require('../models/user');

const handleSignout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) return res.status(204);

	const refreshToken = cookies.jwt;
	const user = await Users.findOne({ refreshToken });

	if (!user) {
		res.clearCookie('jwt', { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
		return res.sendStatus(204);
	}

	await Users.updateOne({ refreshToken }, { $set: {refreshToken: ''} });
	res.clearCookie('jwt', { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); 
	res.sendStatus(204);
}

module.exports = handleSignout;