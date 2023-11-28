const express = require("express");
const app = express();
const fs = require("fs");

const PORT = env.process.PORT || 3000;

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/video", function (req, res) {});

app.post("/upload", function (req, res) {});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
