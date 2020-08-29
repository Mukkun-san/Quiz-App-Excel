var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { google } = require('googleapis');
var cors = require("cors");

var app = express();

app.use(cors({ origin: "https://quizappexcel.herokuapp.com/" }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sheets = google.sheets({ version: 'v4', auth: "AIzaSyDdfiGWXVGrZzGV04siZKCdLYlsTdQVciM" });



app.get('/', (req, response) => {
  let ranges = [];
  let questions = [];
  let parsedQuestions = [];

  sheets.spreadsheets.get({
    spreadsheetId: '19myrR21IIGa0kGdDYCgUxr46-PaEITa16nXJJNq28O4',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    let i = 0
    while (res.data.sheets[i]) {
      ranges.push(res.data.sheets[i].properties.title);
      i++
    }
    sheets.spreadsheets.values.batchGet({
      spreadsheetId: '19myrR21IIGa0kGdDYCgUxr46-PaEITa16nXJJNq28O4',
      ranges: ranges
    }, (err, res) => {

      if (err) return console.log('The API returned an error: ' + err);
      let j = 0;
      let Tranges = [];
      while (res.data.valueRanges[j]) {
        if (res.data.valueRanges[j].values) {
          Tranges.push(ranges[j])
          let skip = 0;
          let tempQuests = res.data.valueRanges[j].values.map((x) => {
            if (skip > 0) {
              const temp = {
                Question: x[0],
                A: x[1],
                B: x[2],
                C: x[3],
                D: x[4],
                Correct_Answer: x[5]
              }
              return temp;
            }
            skip++;
          });
          tempQuests.shift()
          questions.push({ sheet: ranges[j], Questions: tempQuests });
        }
        j++
      }
      questions.unshift(Tranges);
      response.json(questions);
    });
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
