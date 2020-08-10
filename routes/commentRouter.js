var express = require('express');
var commentRouter = express.Router({ mergeParams: true });

var Comment = require('../models/comment')
var Review = require('../models/review')
var middleware = require('../middleware/index')

//comments form route
commentRouter.get('/new', middleware.isLoggedIn, function(req, res) {
    Review.findById(req.params.reviewId, function(err, review) {
        if (err) {
            console.log(review);
            console.log(err);
        } else {
            console.log(review);
            res.render("Comments/new", { MovieInfo: review });
        }
    })

})

//comments POST route
commentRouter.post('/', middleware.isLoggedIn, function(req, res) {
    Review.findById(req.params.reviewId, function(err, movie) {
        if (err) {
            req.flash("error", "Something went wrong.")
            console.log(err)
            res.redirect('/reviews')
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and it's id to commment
                    console.log(req.user);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    //then save the comment 
                    movie.comments.push(comment);
                    movie.save();
                    req.flash("success", "You successfully added the comment.")
                    res.redirect('/reviews/' + movie._id)
                }
            })
        }
    })
})

//Comment Edit Route
commentRouter.get("/:comment_id/edit", middleware.commentAuthorization, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render('Comments/edit', { MovieInfo_id: req.params.reviewId, comment: foundComment });
        }
    });

})

//Comment Update Route
commentRouter.put("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/moviereviews/' + req.params.reviewId);
        }
    })
})

//COMMENT DESTROY ROUTE
commentRouter.delete("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash("success", "You successfully deletd comment.")
            res.redirect('/moviereviews/' + req.params.reviewId);
        }
    })
})




module.exports = commentRouter;