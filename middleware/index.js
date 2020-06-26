var MovieInfo = require('../models/movieschema')
var Comment = require('../models/comment')

// All middleware goes here
var middlewareObj = {};

middlewareObj.reviewAuthorization = function(req, res, next) {
    //is user logged in or not !!!
    if (req.isAuthenticated()) {
        MovieInfo.findById(req.params.id, function(err, editReview) {
            if (err) {
                res.redirect('back');
            } else {
                //does user own the review
                if (editReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

middlewareObj.commentAuthorization = function(req, res, next) {
    //is user logged in or not !!!
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect('back');
            } else {
                //does user own the Comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first !!");
    res.redirect('/login');
}

module.exports = middlewareObj;