var express = require('express');
var bodyParser = require('body-parser');

var reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

var Review = require('../models/review');
var middleware = require('../middleware/index')


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
        var name = req.body.name;
        var title = req.body.title;
        var image = req.body.url;
        var review = req.body.review;
        var author = {
            id: req.user._id,
            username: req.user.username,
        }
        Review.create({
            title: title,
            image: image,
            review: review,
            author: author,
        }, (err, MovieInfo) => {
            if (err) {
                console.log(err);
            } else {
                console.log(MovieInfo);
            }
            //redirect to movie review page 
            res.redirect("/reviews");
        });
    })


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