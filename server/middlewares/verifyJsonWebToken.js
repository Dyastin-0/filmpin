const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyJsonWebToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	console.log(req.cookies);
	if (!authHeader) return res.sendStatus(401);
	console.log(authHeader); //bearer token
	const token = authHeader.split(' ')[1];
	jwt.verify(
		token,
		process.ACCESS_TOKEN_SECRET,
		(error, decoded) => {
			if (error) return res.sendStatus(403); //invalid token
			req.username = decoded.username;
			next();
		}
	);
}

module.exports = {
	verifyJsonWebToken
}