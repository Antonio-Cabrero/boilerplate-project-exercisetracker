const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: { type: String, required: false },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = { Exercise, exerciseSchema };
