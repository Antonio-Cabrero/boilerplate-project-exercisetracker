const router = require("express").Router();
const User = require("../models/User");

// GET
router.get("/users", async (req, res) => {
	// get users as array
	const users = await User.find();
	if (!users) {
		return res.status(404).json({ error: "No users found" });
	}
	res.json(users);
});

router.get("/users/:_id", (req, res) => {
	// get user by id
	res.json({ username: "username", _id: 1 });
});

router.get("/users/:_id/exercises", (req, res) => {
	// get exercises as array
	res.json({ greeting: "hello API" });
});

router.get("/users/:_id/logs", (req, res) => {
	// return the user object with a log array of all the exercises added.
	res.json({ greeting: "hello API" });
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

router.post("/users/:_id/exercises", (req, res) => {
	// create new exercise
	// if not date supplied, use current date
	// returns user object with exercise added
	res.json({ username: req.body.url, _id: 1 });
});

module.exports = router;
