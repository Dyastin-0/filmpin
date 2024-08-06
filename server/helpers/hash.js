const bcrypt = require('bcrypt');

const passwordSaltRounds = 10;

const hash = async (password) => {
	try {
		const hashed = await bcrypt.hash(password, passwordSaltRounds);
		return hashed;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

const compare = async (orig, hashed) => {
	try {
		const matched = await bcrypt.compare(orig, hashed);
		return matched;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

module.exports = {
	hash, compare
}