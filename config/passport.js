var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
  	function (username, password, done) {
	    User.findOne({ username: username }, function (err, user) {
	      	if (err) { return done(err); }
	      	if (!user) {
	        	return done(null, false, { message: '用户名错误.' });
	      	}
	      	if (!user.validPassword(password)) {
	        	return done(null, false, { message: '密码错误.' });
	      	}
	      	return done(null, user);
	    });
  	}
));