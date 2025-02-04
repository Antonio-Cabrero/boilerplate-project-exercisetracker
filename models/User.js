const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: { type: String, required: true },
	_id: { type: Schema.Types.ObjectId, auto: true },
});

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
