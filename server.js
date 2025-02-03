const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO, {
	serverSelectionTimeoutMS: 5000,
});

const connectDB = mongoose.connection;
connectDB.on("error", console.error.bind(console, "connection error"));
connectDB.once("open", () => {
	console.log("Connection Successful");
});

module.exports = connectDB;
