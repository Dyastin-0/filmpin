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
	verificationToken: {
		type: String
	},
	recoveryToken: {
		type: String
	},
	verified: {
		type: Boolean,
		default: false
	},
	refreshToken: {
		type: [String]
	},
	roles: {
		type: [String],
		default: ['122602']
	},
	backdropPath: {
		type: String
	}
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;