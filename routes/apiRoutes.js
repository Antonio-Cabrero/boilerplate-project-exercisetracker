const router = require("express").Router();
const User = require("../models/User");
const { Exercise } = require("../models/Exercise");
const Log = require("../models/Log");

// GET
router.get("/users", async (req, res) => {
	// get users as array
	const users = await User.find();
	if (!users) {
		return res.status(404).json({ error: "No users found" });
	}
	res.json(users);
});

router.get("/users/:_id", async (req, res) => {
	// get user by id
	let user = await User.findOne({ _id: req.params._id });
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
	res.json({ username: user.username, _id: user._id });
});

router.get("/users/:_id/logs", async (req, res) => {
	// return the user object with a log array of all the exercises added.
	let userLogs;
	const { from, to, limit } = req.query;
	const fromDate = new Date(from);
	const toDate = new Date(to);
	const query = { _id: req.params._id };

	if (from) {
		query["log.date"] = { $gte: fromDate };
	}
	if (to) {
		query["log.date"] = query["log.date"] || {};
		query["log.date"] = { $lte: toDate };
	}

	userLogs = await Log.findOne(query).select("log count username _id");

	if (!userLogs === null || userLogs.log.length === 0) {
		return res
			.status(404)
			.json({ error: "Nothing found within the time period" });
	}

	let logs = userLogs.log;
	if (limit) {
		logs = logs.slice(0, limit);
	}

	res.json({
		_id: userLogs._id,
		username: userLogs.username,
		from: from ? fromDate.toDateString() : undefined,
		to: to ? toDate.toDateString() : undefined,
		count: userLogs.count,
		log: logs,
	});
});

// POST
router.post("/users", async (req, res) => {
	// create new user
	let user = await User.findOne({ username: req.body.username });
	if (user) {
		return res.status(400).json({ error: "Username already taken" });
	} else {
		user = new User({
			username: req.body.username,
		});
		await user.save();
		res.json({ username: user.username, _id: user._id });
	}
});

router.post("/users/:_id/exercises", async (req, res) => {
	// create new exercise
	const { description, duration, _id, date } = req.body;
	let user;
	if (!_id) {
		return res.status(404).json({ error: "Not found" });
	} else {
		user = await User.findOne({ _id: _id });
	}
	if (!description || !duration) {
		return res.status(400).json({ error: "Description and duration required" });
	}
	if (date) {
		date = new Date(date);
	} else {
		date = new Date();
	}
	// if not date supplied, use current date

	const logExercise = {
		description,
		duration,
		date,
	};

	let userLogs = await Log.findOne({ _id: user._id });

	if (!userLogs) {
		userLogs = new Log({
			username: user.username,
			count: 0,
			_id: user._id,
			log: [],
		});
	}
	userLogs.count++;
	userLogs.log.push(logExercise);
	await userLogs.save();

	// returns user object with exercise added

	res.json({
		username: user.username,
		_id: user._id,
		description: description,
		duration: duration,
		date: date.toDateString(),
	});
	// return res.json(exercise);
});

module.exports = router;
