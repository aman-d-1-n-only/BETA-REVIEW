var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');

var reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

var Review = require('../models/review');
var middleware = require('../middleware/index');
var config = require('../config');
const { default: Axios } = require('axios');


reviewRouter.route('/')
    .get((req, res, next) => {

        Review.find({}, (err, movieInfo) => {
            if (err) {
                console.log(err);
            } else {
                res.render("MovieReviews/index", { MovieInfo: movieInfo, currentUser: req.user });
            }
        });
    })
    .post(middleware.isLoggedIn, (req, res) => {
        axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${config.api_key}&language=en-US&query=${req.body.title}&page=1&include_adult=false`)
            .then(data => {
                var data = data.data.results;
                return data;
            })
            .then(data => {
                data.forEach(value => {
                    if (value.original_title) {
                        var link = `https://image.tmdb.org/t/p/w500/${value.poster_path}`;
                        req.body.title = value.title;
                        req.body.image = link
                        console.log(req.body.image);
                        req.body.tmdb_id = value.id;
                        req.body.author = {};
                        req.body.author.id = req.user._id;
                        req.body.author.username = req.user.username;
                        console.log(req.body);
                        return Review.create(req.body)

                    }
                    if (value.original_name) {
                        var link = `https://image.tmdb.org/t/p/w500/${value.poster_path}`;
                        req.body.title = value.name;
                        req.body.image = link
                        console.log(req.body.image);
                        req.body.tmdb_id = value.id;
                        req.body.author = {};
                        req.body.author.id = req.user._id;
                        req.body.author.username = req.user.username;
                        console.log(req.body);
                        return Review.create(req.body)

                    }
                });
            })
            .then((review) => {
                console.log(review);
                req.flash('success', 'You successfully added a review.')
                res.redirect("/reviews");
            })
            .catch(err => {
                console.log(err);
                req.flash('error', 'Something went wrong !!!');
                res.redirect("/");
            })
            .catch(err => {
                console.log(err);
            });
    });


//Review Form Route
reviewRouter.get("/form", middleware.isLoggedIn, (req, res) => {
    res.render("MovieReviews/new");
});

//Review Edit Route
reviewRouter.get('/:reviewId/edit', middleware.reviewAuthorization, (req, res) => {
    Review.findById(req.params.reviewId, (err, editReview) => {
        res.render("MovieReviews/edit", { Review: editReview });
    })
});


reviewRouter.route('/:reviewId')
    .get((req, res) => {
        Review.findById(req.params.reviewId).populate('comments').exec((err, review) => {
            if (err) {
                console.log(err);
            } else {
                console.log(review)
                res.render("MovieReviews/show", { MovieInfo: review });
            }
        })

    })
    .put(middleware.reviewAuthorization, (req, res) => {

        Review.findByIdAndUpdate(req.params.reviewId, req.body.Movie, (err, updatedReview) => {
            if (err) {
                res.redirect('/reviews')
            } else {
                res.redirect('/reviews/' + req.params.reviewId)
            }
        })
    })
    .delete(middleware.reviewAuthorization, (req, res) => {
        Review.findByIdAndRemove(req.params.reviewId, (err) => {
            if (err) {
                res.redirect('/reviews');
            } else {
                res.redirect('/reviews');
            }
        })
    });

module.exports = reviewRouter;