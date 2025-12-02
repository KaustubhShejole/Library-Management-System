//jshint esversion: 6
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: String,
  name: String,
  enrol_id: String,
  numBooksBorrowed: String,
  contact_number: String,
  bookIds: [String]
}, { typeKey: '$type' });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
