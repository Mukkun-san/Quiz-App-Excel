let mongoose = require("mongoose");

let Student = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  class: String,
  addedOn: String,
  confirmed: Boolean,
});

module.exports = mongoose.model("Student", Student);
