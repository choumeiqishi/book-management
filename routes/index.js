var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Book = mongoose.model('Book');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Express' });
});

router.param('book', function(req, res, next, id) {
  var query = Book.findById(id);

  query.exec(function (err, book){
    if (err) { return next(err); }
    if (!book) { return next(new Error('can\'t find book')); }

    req.book = book;
    return next();
  });
});

// get book list
router.get('/books', function (req, res, next) {
	Book.find(function (err, books) {
		if (err) {
			return next(err);
		}
		res.json(books);
	});
});

// create a new book
router.post('/books', function (req, res, next) {
	var book = new Book(req.body);
	book.save(function (err, book) {
		if (err) {
			return next(err);
		}
		res.json(book);
	});
});

// get a book
router.get('/books/:book', function (req, res) {
  	res.json(req.book);
});

// update a book
router.put('/books/:book', function (req, res, next) {
	console.log(req.body);
	Book.findByIdAndUpdate(req.book._id, req.body, function(err, book) {
	  	if (err) {
	  		return next(err);
	  	}
	 	res.json(book);
	});
});

// remove a book
router.delete('/books/:book', function (req, res, next) {
	Book.findByIdAndRemove(req.book._id, function(err) {
  		if (err) {
  			return next(err);
  		}
  		return res.json('book deleted');
	});
});

module.exports = router;
