//jshint esversion:8

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name:  String,
}, { typeKey: '$type' });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
