const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifySocketJsonWebToken = (socket, next) => {
	const authHeader = socket.handshake.headers['authorization'];
	if (!authHeader) return next(new Error('Unauthorized.'));
	const token = authHeader?.split(' ')[1];

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(error, decoded) => {
			if (error) return next(new Error('Access token expired.'));
			socket.username = decoded.UserInfo.username;
			socket.email = decoded.UserInfo.email;
			socket.roles = decoded.UserInfo.roles;
			socket.id = decoded.UserInfo.id;
			socket.token = token;
			next();
		}
	);
}

module.exports = verifySocketJsonWebToken;