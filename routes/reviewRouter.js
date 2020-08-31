var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');

var reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

var Review = require('../models/review');
var middleware = require('../middleware/index');
var config = require('../config');
var need = require('../need');
const { default: Axios } = require('axios');


reviewRouter.route('/')
    .get((req, res, next) => {
        Review.find({}, (err, Reviews) => {
            if (err) {
                console.log(err);
            } else {
                var articles = need.entr_news.filter(article => {
                    return article.urlToImage !== null;
                })
                res.render("MovieReviews/index", { Reviews: Reviews, currentUser: req.user, articles: articles });
            }
        });
    })
    .post(middleware.isLoggedIn, (req, res) => {
        axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${config.api_key}&language=en-US&query=${req.body.title}&page=1&include_adult=false`)
            .then(data => {
                var data = data.data.results;
                return data;
            })
            .then(value => {
                if (value[0].original_title) {
                    var link = `https://image.tmdb.org/t/p/w500/${value[0].poster_path}`;
                    req.body.title = value[0].title;
                    req.body.image = link
                    console.log(req.body.image);
                    req.body.tmdb_id = value[0].id;
                    req.body.author = {};
                    req.body.author.id = req.user._id;
                    req.body.author.username = req.user.username;
                    console.log(req.body);
                    return Review.create(req.body)

                }
                if (value[0].original_name) {
                    var link = `https://image.tmdb.org/t/p/w500/${value[0].poster_path}`;
                    req.body.title = value[0].name;
                    req.body.image = link
                    console.log(req.body.image);
                    req.body.tmdb_id = value[0].id;
                    req.body.author = {};
                    req.body.author.id = req.user._id;
                    req.body.author.username = req.user.username;
                    console.log(req.body);
                    return Review.create(req.body)
                }
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

//Review Edit Route
reviewRouter.get('/:reviewId/edit', middleware.reviewAuthorization, (req, res) => {
    Review.findById(req.params.reviewId, (err, editReview) => {
        console.log("Hello we found you !!");
        res.render("MovieReviews/edit", { review: editReview });
    })
});


reviewRouter.route('/:reviewId')
    .get((req, res) => {
        Review.findById(req.params.reviewId)
            .populate('comments')
            .then(review => {
                axios.get(`https://api.themoviedb.org/3/movie/${review.tmdb_id}?api_key=${config.api_key}&language=en-US`)
                    .then(shows => {
                        res.render("MovieReviews/show", { review: review, shows: shows.data });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    })
    .put(middleware.reviewAuthorization, (req, res) => {
        Review.findByIdAndUpdate(req.params.reviewId, { $set: req.body }, { new: true })
            .then(updatedReview => {
                req.flash("success", "You successfully edited review.");
                res.redirect('/reviews/' + req.params.reviewId)
            })
            .catch(err => {
                console.log(err);
                req.flash("error", "Something went wrong !!! ");
                res.redirect('/reviews');
            });
    })
    .delete(middleware.reviewAuthorization, (req, res) => {
        Review.findByIdAndRemove(req.params.reviewId, (err) => {
            if (err) {
                req.flash("error", "Something went wrong !!! ");
                res.redirect('/reviews');
            } else {
                req.flash("success", "You successfully deleted review.");
                res.redirect('/reviews');
            }
        })
    });

module.exports = reviewRouter;