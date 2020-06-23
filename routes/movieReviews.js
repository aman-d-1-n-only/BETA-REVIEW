var express = require('express');
var router = express.Router();
var MovieInfo = require('../models/movieschema')
var middleware = require('../middleware/index')

//ROUTES TO MOVIE REVIEWS PAGE
router.get("/", function(req, res) {

    MovieInfo.find({}, function(err, movieInfo) {
        if (err) {
            console.log(err);
        } else {
            res.render("MovieReviews/index", { MovieInfo: movieInfo, currentUser: req.user });
        }
    });
});

//POST route of form for adding review
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var title = req.body.title;
    var image = req.body.url;
    var review = req.body.review;
    var author = {
        id: req.user._id,
        username: req.user.username,
    }
    MovieInfo.create({

            title: title,
            image: image,
            review: review,
            author: author,

        },

        function(err, MovieInfo) {
            if (err) {
                console.log(err);
            } else {
                console.log(MovieInfo);
            }
            //redirect to movie review page 
            res.redirect("/moviereviews");
        });
});


//form for adding review
router.get("/form", middleware.isLoggedIn, function(req, res) {
    res.render("MovieReviews/new");
});


// show page for each review
router.get("/:id", function(req, res) {
    MovieInfo.findById(req.params.id).populate('comments').exec(function(err, review) {
        if (err) {
            console.log(err);
        } else {
            console.log(review)
            res.render("MovieReviews/show", { MovieInfo: review });
        }
    })

})

//Review Edit route
router.get('/:id/edit', middleware.reviewAuthorization, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, editReview) {
        res.render("MovieReviews/edit", { Review: editReview });
    })
});
//Review Update route
router.put('/:id', middleware.reviewAuthorization, function(req, res) {

    MovieInfo.findByIdAndUpdate(req.params.id, req.body.Movie, function(err, updatedReview) {
        if (err) {
            res.redirect('/moviereviews')
        } else {

            res.redirect('/moviereviews/' + req.params.id)
        }
    })
});

//Destroying a Review
router.delete('/:id', middleware.reviewAuthorization, function(req, res) {
    MovieInfo.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/moviereviews');
        } else {
            res.redirect('/moviereviews');
        }
    })
});




module.exports = router;