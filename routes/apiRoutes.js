const router = require("express").Router();

// GET
router.get("/users", (req, res) => {
	// get users as array
	res.json({ greeting: "hello API" });
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
router.post("/users", (req, res) => {
	// create new user
	res.json({ username: req.body.url, _id: 1 });
});

router.post("/users/:_id/exercises", (req, res) => {
	// create new exercise
	// if not date supplied, use current date
	// returns user object with exercise added
	res.json({ username: req.body.url, _id: 1 });
});

module.exports = router;
