/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("*", async (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3005, () => {
	console.log("Server successfully running on port 3005");
});
