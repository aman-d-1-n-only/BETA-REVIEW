var express = require('express');
var router = express.Router({ mergeParams: true });
var Comment = require('../models/comment')
var MovieInfo = require('../models/movieschema')

//comments form route
router.get('/new', isLoggedIn, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, review) {
        if (err) {
            console.log(err)
        } else {
            res.render("Comments/new", { MovieInfo: review });
        }
    })

})

//comments POST route
router.post('/', isLoggedIn, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, movie) {
        if (err) {
            console.log(err)
            res.redirect('/moviereviews')
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    movie.comments.push(comment);
                    movie.save();
                    res.redirect('/moviereviews/' + movie._id)
                }
            })
        }
    })
})

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

module.exports = router;