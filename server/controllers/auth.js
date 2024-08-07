const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { compare } = require('../helpers/hash');

const handleAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Bad request. Missing input: Email.' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Bad request. Invalid input: Password.' });
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const matched = await compare(password, user.password);
    if (matched) {
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

			const refreshToken = jwt.sign(
				{ username: user.username },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '30d' }
			);

			await Users.updateOne({ email: user.email }, { $set: { refreshToken: refreshToken } });
			
			res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
			res.status(200).json({
				accessToken, 
				user: { username: user.username, email: user.email } 
			});
		} else {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
	handleAuth
}