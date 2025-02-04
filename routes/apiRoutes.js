const router = require("express").Router();
const User = require("../models/User");
const Exercise = require("../models/Exercise");

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

router.get("/users/:_id/exercises", async (req, res) => {
	// get exercises as array
	let user = await User.findOne({ _id: req.query.id });
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
	res.json({ username: user.username, _id: user._id });
});

router.get("/users/:_id/logs", (req, res) => {
	// return the user object with a log array of all the exercises added.
	res.json({ greeting: "hello API" });
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
	console.log(req.body);
	let user = null;
	if (!_id) {
		return res.status(404).json({ error: "Not found" });
	} else {
		user = await User.findOne({ _id });
	}
	if (!description || !duration) {
		return res.status(400).json({ error: "Description and duration required" });
	}
	let date = req.body.date;
	// if not date supplied, use current date
	if (date === "") {
		date = new Date().toISOString().substring(0, 10);
	}
	let exercise = new Exercise({
		description,
		duration,
		date,
	});
	if (user && exercise) {
		// returns user object with exercise added
		const result = {
			_id: user._id,
			username: user.username,
			date: exercise.date.toDateString(),
			duration: exercise.duration,
			description: exercise.description,
		};
		await result.save();
		return res.json(result);
	}
});

module.exports = router;
