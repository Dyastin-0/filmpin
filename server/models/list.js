const mongoose = require('mongoose');
const { Schema } = mongoose;

const ListSchema = new Schema({
	owner: {
		type: String
	},
	name: {
		type: String
	},
	type: {
		type: String
	},
	list: {
		type: [String]
	},
	created_on: {
		type: Number,
		default: Date.now
	}
});

const ListModel = mongoose.model('List', ListSchema);

module.exports = ListModel;