//jshint esversion:8

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:  String,
  subjects: [String],
}, { typeKey: '$type' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
