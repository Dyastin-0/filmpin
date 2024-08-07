const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyJsonWebToken = (req, res, next) => {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	console.log(req.headers);
	if (!authHeader) return res.sendStatus(401);
	const token = authHeader.split(' ')[1];
	console.log(token);
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(error, decoded) => {
			if (error) return res.sendStatus(403); //invalid token
			req.username = decoded.userInfo.username;
			req.roles = decoded.userInfo.roles;
			next();
		}
	);
}

module.exports = {
	verifyJsonWebToken
}