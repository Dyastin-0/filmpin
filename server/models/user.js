const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	username: {
		type: String
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String
	},
	refreshToken: {
		type: [String]
	},
	roles: {
		type: [String],
		default: ['122602']
	}
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;