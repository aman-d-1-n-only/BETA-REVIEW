var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');

var reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

var Review = require('../models/review');
var Comments = require('../models/comment')
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
                console.log(value)
                if (value.length > 0) {
                    if (value[0].original_title) {
                        if (value[0].poster_path == null) {
                            req.body.image = 'empty';
                        } else {
                            var link = `https://image.tmdb.org/t/p/w500/${value[0].poster_path}`;
                            req.body.image = link;
                        }
                        req.body.title = value[0].title;
                        console.log(req.body.image);
                        req.body.tmdb_id = value[0].id;
                        req.body.author = {};
                        req.body.author.id = req.user._id;
                        req.body.author.username = req.user.username;
                        console.log(req.body);
                        return Review.create(req.body)
                    }
                    if (value[0].original_name) {
                        if (value[0].poster_path == null) {
                            req.body.image = 'empty';
                        } else {
                            var link = `https://image.tmdb.org/t/p/w500/${value[0].poster_path}`;
                            req.body.image = link;
                        }
                        req.body.title = value[0].name;
                        console.log(req.body.image);
                        req.body.tmdb_id = value[0].id;
                        req.body.author = {};
                        req.body.author.id = req.user._id;
                        req.body.author.username = req.user.username;
                        console.log(req.body);
                        return Review.create(req.body)
                    }
                } else {
                    req.body.image = 'empty';
                    req.body.author = {};
                    req.body.author.id = req.user._id;
                    req.body.author.username = req.user.username;
                    return Review.create(req.body);
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
        Review.findByIdAndRemove(req.params.reviewId)
            .then((resp) => {
                resp.comments.forEach(comment_id => {
                    console.log(comment_id);
                    Comments.findByIdAndDelete(comment_id)
                        .then((resp) => {
                            req.flash("success", "You successfully deleted review.");
                            res.redirect('/reviews');
                        })
                        .catch(err => {
                            req.flash("error", "Something went wrong !!! ");
                            res.redirect('/reviews');
                        })
                });
            })
            .catch(err => {
                req.flash("error", "Something went wrong !!! ");
                res.redirect('/reviews');
            });
    });

module.exports = reviewRouter;