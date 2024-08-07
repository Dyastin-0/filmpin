const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const handleRefreshAccessToken = async (req, res) => {
	try {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);

		const refreshToken = cookies.jwt;
		const user = await Users.findOne({ refreshToken });

		if (!user) return res.sendStatus(403);

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			(error, decoded) => {
				if (error || user.username !== decoded.username) return res.sendStatus(403);
				const accessToken = jwt.sign(
					{ 
						UserInfo: {
							username: user.username,
							roles: user.roles
						}
					 },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: '15m' }
				);
				res.status(200).json({
					accessToken, 
					user: { username: user.username, email: user.email } 
				});
			}
		);
	
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = handleRefreshAccessToken;