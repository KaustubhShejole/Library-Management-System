//jshint esversion: 6
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/libraryDB", { useNewUrlParser: true });
