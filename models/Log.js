const mongoose = require("mongoose");
const { exerciseSchema } = require("./Exercise");

const Schema = mongoose.Schema;

const LogSchema = new Schema({
	username: String,
	count: { type: Number, required: true },
	_id: { type: String, required: true },
	log: [exerciseSchema],
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
