var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//sign-up page route
router.get('/register', function(req, res) {
    res.render('register')
})

//sign-up POST route
router.post('/register', function(req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/moviereviews')
        })
    })
})

//login page route
router.get('/login', function(req, res) {
    res.render('login')
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
    res.redirect('/moviereviews')

})

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

module.exports = router;