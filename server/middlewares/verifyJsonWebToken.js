const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyJsonWebToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.sendStatus(401);
	const token = authHeader.split(' ')[1];
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(error, decoded) => {
			if (error) return res.sendStatus(403);
			req.username = decoded.UserInfo.username;
			req.email = decoded.UserInfo.email;
			req.roles = decoded.UserInfo.roles;
			req.id = decoded.UserInfo.id;
			next();
		}
	);
}

module.exports = {
	verifyJsonWebToken
}