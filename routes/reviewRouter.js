var express = require('express');
var bodyParser = require('body-parser');
const utf8 = require('utf8');
var axios = require('axios');

var reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

var Review = require('../models/review');
var Comments = require('../models/comment')
var middleware = require('../middleware/index');
require('dotenv').config();
var need = require('../need');
const { default: Axios } = require('axios');


reviewRouter.route('/')
    .get((req, res, next) => {
        Review.find({}, (err, Reviews) => {
            if (err) {
                console.log(err);
            } else {
                async function display() {
                    if (req.user) {
                        var entr_news = await need.geo_based_news(req.user._id);
                    } else {
                        var entr_news = await need.geo_based_news();
                    }
                    return entr_news;
                }
                display()
                    .then(entr_news => {
                        var articles = entr_news.filter(article => {
                            return article.urlToImage !== null;
                        })
                        res.render("MovieReviews/index", { Reviews: Reviews, currentUser: req.user, articles: articles });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        });
    })
    .post(middleware.isLoggedIn, (req, res) => {
        axios.get(utf8.encode(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${req.body.title}&page=1&include_adult=false`))
            .then(data => {
                var data = data.data.results;
                return data;
            })
            .then(value => {
                console.log(value);
                if (value.length > 0) {
                    var j = 0;
                    var i = 0;
                    while (j < 1 && i < value.length) {
                        if (value[i].title === req.body.title && value[i].original_title) {
                            if (value[i].poster_path == null) {
                                req.body.image = 'empty';
                            } else {
                                var link = `https://image.tmdb.org/t/p/w500/${value[i].poster_path}`;
                                req.body.image = link;
                            }
                            console.log(req.body.title, value[i].title);
                            req.body.title = value[i].title;
                            console.log(req.body.image);
                            req.body.tmdb_id = value[i].id;
                            req.body.media_type = value[i].media_type;
                            req.body.author = {};
                            req.body.author.id = req.user._id;
                            req.body.author.username = req.user.username;
                            console.log(req.body);
                            return Review.create(req.body);
                            j++;
                        }
                        if (value[i].name === req.body.title && value[i].original_name) {
                            if (value[i].poster_path == null) {
                                req.body.image = 'empty';
                            } else {
                                var link = `https://image.tmdb.org/t/p/w500/${value[i].poster_path}`;
                                req.body.image = link;
                            }
                            console.log(req.body.title, value[i].name)
                            req.body.title = value[i].name;
                            console.log(req.body.image);
                            req.body.tmdb_id = value[i].id;
                            req.body.media_type = value[i].media_type;
                            req.body.author = {};
                            req.body.author.id = req.user._id;
                            req.body.author.username = req.user.username;
                            console.log(req.body);
                            return Review.create(req.body);
                            j++;
                        }
                        i++;
                    }
                } else {
                    req.body.image = 'empty';
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
            });
    });

//Review Edit Route
reviewRouter.get('/:reviewId/edit', middleware.reviewAuthorization, (req, res) => {
    Review.findById(req.params.reviewId, (err, editReview) => {
        console.log("Hello we found you !!");
        res.render("MovieReviews/edit", { review: editReview });
    })
});


reviewRouter.get('/reviews/geolocation', middleware.reviewAuthorization, )
    .



reviewRouter.route('/:reviewId')
    .get((req, res) => {
        Review.findById(req.params.reviewId)
            .populate('comments')
            .then(review => {
                console.log(review);
                if (review.tmdb_id) {
                    if (review.media_type == 'movie') {
                        axios.get(`https://api.themoviedb.org/3/movie/${review.tmdb_id}?api_key=${process.env.MOVIE_API_KEY}&language=en-US`)
                            .then(shows => {
                                console.log(shows);
                                res.render("MovieReviews/show", { review: review, shows: shows.data });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                    if (review.media_type == 'tv') {
                        axios.get(`https://api.themoviedb.org/3/tv/${review.tmdb_id}?api_key=${process.env.MOVIE_API_KEY}&language=en-US`)
                            .then(shows => {
                                console.log(shows);
                                res.render("MovieReviews/show", { review: review, shows: shows.data });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                } else {
                    let shows = null;
                    res.render("MovieReviews/show", { review: review, shows: shows });
                }
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
        Review.findByIdAndDelete(req.params.reviewId)
            .then((resp) => {
                if (resp.comments.lengtdata) {
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
                } else {
                    req.flash("success", "You successfully deleted review.");
                    res.redirect('/reviews');
                }
            })
            .catch(err => {
                req.flash("error", "Something went wrong !!! ");
                res.redirect('/reviews');
            });
    });

module.exports = reviewRouter;