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
                console.log(err.message);
                return res.redirect('/signup');

            }
            user.coords.lat = req.body.lat;
            user.coords.lng = req.body.lng;
            user.save();
            passport.authenticate('local')(req, res, () => {
                req.flash("success", `Hello ${user.username} | Welcome to Beta Review | Start Reviewing `);
                res.redirect('/');
            });
        });
    });


//login page route
userRouter.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(passport.authenticate('local', {
        successRedirect: '/',
        successFlash: { type: 'success', message: 'Welcome Back ! Successfully logged in.' },
        failureRedirect: '/login',
        failureFlash: { type: 'error', message: 'Invalid username or password.' },
    }), (req, res) => {});

//log out route
userRouter.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Sucessfully logged you out !!");
    res.redirect('/reviews');
});



module.exports = userRouter;