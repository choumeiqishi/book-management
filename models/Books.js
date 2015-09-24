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

BookSchema.methods.list = function(){
	
};

BookSchema.methods.save = function(){
	
};

BookSchema.methods.get = function(){
	
};

BookSchema.methods.update = function(){
	
};

BookSchema.methods.remove = function(){
	
};

BookSchema.methods.query = function(){
	
};

mongoose.model('Book', BookSchema);