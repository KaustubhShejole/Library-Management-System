//jshint esversion: 6
const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
    serial_number: String,
    title: String,
    author: [String],
    publication: String,
    subject: String,
    isbn: String,
    status: String,
    date: String,
    history_card: String,
}, { typeKey: '$type' });

const Item = mongoose.model("Item", itemsSchema); // Use itemsSchema here

module.exports = Item;
