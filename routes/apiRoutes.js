const router = require("express").Router();
const { User } = require("../models/User");
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
	let user = await User.findOne({ _id: req.query.id });
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
	res.json({ username: user.username, _id: user._id });
});

router.get("/users/:_id/logs", async (req, res) => {
	// return the user object with a log array of all the exercises added.
	let logs = await Log.findOne({ _id: req.query.id });
	if (!logs) {
		return res.status(404).json({ error: "No Logs for this user" });
	}
	res.json({
		_id: logs._id,
		username: logs.username,
		count: logs.count,
		log: logs.log,
	});
});

// POST
router.post("/users", async (req, res) => {
	// create new user
	let user = await User.findOne({ username: req.body.username });
	console.log(req.body);
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
	const { description, duration, _id } = req.body;
	let user;
	if (!_id) {
		return res.status(404).json({ error: "Not found" });
	} else {
		user = await User.findOne({ _id: _id });
	}
	if (!description || !duration) {
		return res.status(400).json({ error: "Description and duration required" });
	}
	const date =
		req.body.date !== ""
			? new Date(req.body.date).toDateString()
			: new Date().toDateString();
	// if not date supplied, use current date

	let exercise = new Exercise({
		description,
		duration,
		date,
	});
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
		description: exercise.description,
		duration: exercise.duration,
		date: exercise.date,
	});
	// return res.json(exercise);
});

module.exports = router;
