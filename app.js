var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("./mongodb");

const { authorize, appendToSheet, getFromSheet } = require("./sheets.js");

var app = express();

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require("./routes"));

app.post("/sheet", (req, res) => {
  authorize(appendToSheet, '{ "name": "erqdf" }').then(async (credentials) => {
    await appendToSheet(credentials, JSON.stringify(req.body));
  });
});

const PORT = process.env.PORT || 4545;
app.listen(PORT, () => console.log(`⚡⚡ ---> Server started on port ${PORT}`));
