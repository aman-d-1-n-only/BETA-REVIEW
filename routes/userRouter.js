var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

var User = require('../models/user');
var middleware = require('../middleware/index');

userRouter.route('/signup')
    .get((req, res, next) => {
        res.render('register');
    })
    .post((req, res, next) => {
        User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect('/signup');
                console.log(err.message);
            }
            passport.authenticate('local')(req, res, () => {
                req.flash("success", "Welcome to Beta-Review " + user.username);
                res.redirect('/reviews');
            })
        });
    });


//login page route
userRouter.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(passport.authenticate('local', {
        successRedirect: '/reviews',
        failureRedirect: '/login',
    }), function(req, res) {

    })

//log out route
userRouter.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Logged you out !!");
    res.redirect('/reviews');

})



module.exports = userRouter;