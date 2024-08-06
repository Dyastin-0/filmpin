const User = require('../models/user');
const { hash, compare } = require('../helpers/hash');

const test = (req, res) => {
	return res.json('API is working.');
}

const Signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		console.log(username, email, password);
		if (!username) return res.status(400).json({message: 'Bad request. Missing input: Username.'});
		if (!email) return res.json({ error: 'Bad request. Missing input: Email.'});
		const emailExist = await User.findOne({email});
		if (emailExist) return res.status(400).json({message: 'Bad request. Email already used.'});
		if (!password || password < 6) return res.status(400).json({message: 'Bad request. Missing input: Password.'});

		const hashedPassword = await hash(password);

		User.create({
			username,
			email,
			password: hashedPassword
		});

		return res.json({username, email});
	} catch (error) {
		console.error(error);
		throw error;
	}
}

const Signin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email) res.json({ error: 'Bad request. Missing input: Email.'});
		if (!password || password < 6) return res.status(400).json({message: 'Bad request. Missing input: Password.'});
		const user = await User.findOne({email});
		if (!user) return res.status(404).json({message: 'User not found.'});
		const matched = compare(password, user.password);
		if (matched) {
			return res.send('User found.');
		}
	} catch (error) {
		
	}
}

module.exports = {
	Signup,
	Signin,
	test
}