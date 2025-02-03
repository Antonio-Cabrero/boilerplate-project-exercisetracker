const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LogSchema = new Schema({
	username: { type: String, required: true },
	count: { type: Number, required: true },
	_id: { type: String, required: true },
	log: [
		{
			description: { type: String, required: true },
			duration: { type: Number, required: true },
			date: { type: Date, required: true },
		},
	],
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
