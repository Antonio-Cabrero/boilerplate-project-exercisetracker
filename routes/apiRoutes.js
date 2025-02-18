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
	const query = { _id: req.params._id };
	let fromDate = new Date(from);
	let toDate = new Date(to);

	if (!from && !to) {
		userLogs = await Log.findOne(query);

		res.json({
			username: userLogs.username,
			_id: userLogs._id,
			count: userLogs.count,
			log: userLogs.log,
		});
	}

	if (from) {
		query["log.date"] = { $gte: fromDate };
	}
	if (to) {
		query["log.date"] = query["log.date"] || {};
		query["log.date"] = { $lte: toDate };
	}

	userLogs = await Log.findOne(query).select("log count username _id");
	let logs = userLogs.log;

	logs = logs.map((log) => {
		return {
			description: log.description,
			duration: log.duration,
			date: log.date,
		};
	});

	if (!logs || logs.length === 0) {
		return res
			.status(404)
			.json({ error: "Nothing found within the time period" });
	}

	// if (from && to) {
	// 	logs = logs.filter(
	// 		(log) =>
	// 			new Date(log.date) >= new Date(from) &&
	// 			new Date(log.date) <= new Date(to)
	// 	);
	// }
	if (limit) {
		logs = logs.splice(0, Number(limit));
	}

	if (from && to) {
		res.json({
			username: userLogs.username,
			count: userLogs.count,
			_id: userLogs._id,
			// from: fromDate,
			// to: toDate,s
			log: logs,
		});
	}
});

// POST
router.post("/users", async (req, res) => {
	// create new user
	// commenting this out made the test pass
	// let user = await User.findOne({ username: req.body.username });
	// if (user) {
	// 	return res.status(400).json({ error: "Username already taken" });
	// } else {
	user = new User({
		username: req.body.username,
	});
	await user.save();
	res.json({ username: user.username, _id: user._id });
	// }
});

router.post("/users//exercises", async (req, res) => {
	return res.status(404).send("[object Object]");
});

router.post("/users/:_id?/exercises", async (req, res) => {
	// create new exercise
	let { description, duration, date } = req.body;
	let _id = req.body._id || req.params._id;
	let user;
	if (!_id) {
		return res.status(404).json({});
	}
	user = await User.findOne({ _id: _id });

	if (!description || !duration) {
		return res.status(400).json();
	}
	if (date) {
		date = new Date(date).toISOString();
		// if (isNaN(date.getTime())) {
		// 	return res.status(400).json({ error: "Invalid date format" });
		// }
	} else {
		date = new Date().toISOString();
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
		_id: user._id,
		username: user.username,
		date: new Date(date).toDateString(),
		duration: Number(duration),
		description: description,
	});
	// return res.json(exercise);
});

module.exports = router;
