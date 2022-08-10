const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	refreshToken: String,
	total: {
		type: Number,
		default: 0,
	},
	win: {
		type: Number,
		default: 0,
	},
	advanced: {
		type: Number,
		default: 0,
	},
	avatar: {
		type: String,
		default: "nruwutqaihxyl7sq6ilm",
	},
});

module.exports = mongoose.model("User", userSchema);
