var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();
var Book = mongoose.model('Book');
var User = mongoose.model('User');

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

// query book
router.post('/bookcount', function (req, res, next) {
	Book.count(req.body, function (err, count) {
		if (err) {
			return next(err);
		}
		return res.json(count);
	});
});

// register
router.post('/register', function (req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({message: '请填写所有项'});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);

	user.save(function (err) {
		if (err) {
			return next(err);
		}
		return res.json({token: user.generateJWT()});
	});
});

// login
router.post('/login', function (req, res, next) {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({message: '请填写所有项'});
	}

	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err); }

		if (user) {
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

module.exports = router;
