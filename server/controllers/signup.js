const Users = require('../models/user');
const { sendTextEmail } = require('../helpers/email');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { hash } = require('../helpers/hash');

const handleSignup = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username) return res.status(400).json({ message: 'Bad request. Username missing.' });
		if (!email) return res.json({ message: 'Bad request. Email missing.' });
		const emailExist = await Users.findOne({ email });
		if (emailExist) return res.status(400).json({ message: `Bad request. Email ${email} is already used.` });
		if (!password) return res.status(400).json({ message: 'Bad request. Password missing.' });

		const hashedPassword = await hash(password);

		const user = await Users.create({
			username,
			email,
			password: hashedPassword
		});

		const verificationToken = jwt.sign(
			{ username: username, email: email },
			process.env.EMAIL_TOKEN_SECRET,
			{ expiresIn: '5m' }
		);

		sendTextEmail(
			email,
			'Verify your Filmpin account.',
			`filmpin-api.onrender.com/verify?verificationToken=${verificationToken}`,
		);

		res.sendStatus(200);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

module.exports = handleSignup;