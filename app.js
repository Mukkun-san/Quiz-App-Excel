var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

const { authorize, appendToSheet, getFromSheet } = require('./sheets.js');

var app = express();

app.use(cors({ origin: "*" }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  authorize(appendToSheet, '{ "name": "erqdf" }').then(async (auth) => {
    const sheetData = await getFromSheet(auth);
    res.send(JSON.stringify(sheetData))
  });
})

app.post('/sheet', (req, res) => {
  authorize(appendToSheet, '{ "name": "erqdf" }').then(async (credentials) => {
    await appendToSheet(credentials, JSON.stringify(req.body));
  });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
