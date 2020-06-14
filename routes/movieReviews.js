var express = require('express');
var router = express.Router();
var MovieInfo = require('../models/movieschema')

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
router.post("/", isLoggedIn, function(req, res) {
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
router.get("/form", isLoggedIn, function(req, res) {
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

//editing campground route
router.get('/:id/edit', function(req, res) {
    MovieInfo.findById(req.params.id, function(err, editReview) {
        if (err) {
            console.log(err);
        } else {
            res.render("MovieReviews/edit", { Review: editReview });
        }
    })

});
//updating campground route
router.put('/:id', function(req, res) {
    MovieInfo.findByIdAndUpdate(req.params.id, req.body.Movie, function(err, editedReview) {
        if (err) {
            res.redirect('/moviereviews')
        } else {
            res.redirect('/moviereviews/' + req.params.id)
        }
    })
});

//Destroying a campground
router.delete('/:id', function(req, res) {
    MovieInfo.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/moviereviews');
        } else {
            res.redirect('/moviereviews');
        }
    })
});
//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

module.exports = router;