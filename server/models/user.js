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
		type: String
	}
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;