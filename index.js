const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const connectDB = require("./server");
require("dotenv").config();

//DB
connectDB;

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
