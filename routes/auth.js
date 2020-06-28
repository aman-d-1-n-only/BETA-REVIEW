var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var middleware = require('../middleware/index');

//sign-up page route
router.get('/register', function(req, res) {
    res.render('register')
})

//sign-up POST route
router.post('/register', function(req, res) {
    var newUser = new User({ username: req.body.username })
    console.log(req.body.username);
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/register');
            console.log(err.message)

        }
        passport.authenticate('local')(req, res, function() {
            req.flash("success", "Welcome to BETA-REVIEW " + user.username)
            res.redirect('/moviereviews')
        })
    })
})

//login page route
router.get('/login', function(req, res) {
    res.render('login');
})

//login POST route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/moviereviews',
    failureRedirect: '/login',
}), function(req, res) {

})

//log out route
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("success", "Logged you out !!");
    res.redirect('/moviereviews');

})



module.exports = router;