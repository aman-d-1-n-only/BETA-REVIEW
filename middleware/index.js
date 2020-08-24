var Review = require('../models/review')
var Comment = require('../models/comment')

// All middleware goes here
var middlewareObj = {};

middlewareObj.reviewAuthorization = function(req, res, next) {
    //is user logged in or not !!!
    if (req.isAuthenticated()) {
        Review.findById(req.params.id, function(err, editReview) {
            if (err) {
                req.flash("error", "Review not found.")
                res.redirect('back');
            } else {
                //does user own the review
                if (editReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Your permission is denied.")
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in.")
        res.redirect('back');
    }
}

middlewareObj.commentAuthorization = function(req, res, next) {
    //is user logged in or not !!!
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found.")
                res.redirect('back');
            } else {
                //does user own the Comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Your permission is denied.")
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in.")
        res.redirect('back');
    }
}

//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first !");
    res.redirect('/login');
}

module.exports = middlewareObj;