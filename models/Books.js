var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	title: String,
	author: String,
	category: Number,
	isbn: String,
	label: String,
	press: String,
	date: Date,
	position: String,
	status: Number,
	stars: Number,
	cover: String,
	notes: String
});

mongoose.model('Book', BookSchema);