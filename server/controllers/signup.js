const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { hash } = require('../helpers/hash');

const handleSignup = async (req, res) => {
	try {
		const { username, email, password } = req.body;
	
		if (!username) return res.status(400).json({message: 'Bad request. Username missing.'});
		if (!email) return res.json({ message: 'Bad request. Email missing.'});
		const emailExist = await Users.findOne({email});
		if (emailExist) return res.status(400).json({message: `Bad request. Email ${email} is already used.`});
		if (!password) return res.status(400).json({message: 'Bad request. Password missing.'});

		const hashedPassword = await hash(password);

		const user = await Users.create({
			username,
			email,
			password: hashedPassword
		});

		const accessToken = jwt.sign(
			{ 
				UserInfo: {
					username: user.username,
					email: user.email,
					roles: user.roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		const refreshToken = jwt.sign(
			{ username: username, email: email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		await Users.updateOne({ email }, { $set: { refreshToken: refreshToken } })

		res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
		res.status(200).json({
			accessToken, 
			user: { username: username, email: email } 
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
}

module.exports = handleSignup;