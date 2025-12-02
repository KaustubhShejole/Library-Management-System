//jshint esversion: 6
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  student_id: String,
  name: String,
  // enrol_id: String,
  numBooksBorrowed: String,
  contact_number: String,
  bookIds: [String]
}, { typeKey: '$type' });

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
