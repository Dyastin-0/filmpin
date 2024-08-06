const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { hash, compare } = require('../helpers/hash');

const test = (req, res) => {
	return res.json('API is working.');
}

const handleSignup = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		console.log(username, email, password);
		if (!username) return res.status(400).json({message: 'Bad request. Missing input: Username.'});
		if (!email) return res.json({ error: 'Bad request. Missing input: Email.'});
		const emailExist = await Users.findOne({email});
		if (emailExist) return res.status(400).json({message: 'Bad request. Email already used.'});
		if (!password || password < 6) return res.status(400).json({message: 'Bad request. Missing input: Password.'});

		const hashedPassword = await hash(password);

		Users.create({
			username,
			email,
			password: hashedPassword
		});

		res.json({username, email});
	} catch (error) {
		console.error(error);
		throw error;
	}
}

const handleSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Bad request. Missing input: Email.' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Bad request. Invalid input: Password.' });
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const matched = await compare(password, user.password);
    if (matched) {
			const accessToken = jwt.sign(
				{ username: user.username },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '5s' }
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
					{ username: user.username },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: '5s' }
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

module.exports = {
	handleSignup,
	handleSignin,
	handleRefreshAccessToken,
	handleSignout,
	test
}