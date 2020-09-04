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
            console.log(req.body.comment);
            Comment.create(req.body, function(err, comment) {
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
            res.render('Comments/edit', { review_id: req.params.reviewId, comment: foundComment });
        }
    });

})

//Comment Update Route
commentRouter.put("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, { $set: req.body }, { new: true })
        .then(updatedCommen => {
            req.flash("success", "You successfully edited comment.");
            res.redirect('/reviews/' + req.params.reviewId);
        })
        .catch(err => {
            req.flash("error", "Something went wrong !!! ");
            res.redirect('/reviews/' + req.params.reviewId);
        });
})

//COMMENT DESTROY ROUTE
commentRouter.delete("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Review.findById(req.params.reviewId)
        .then((review) => {
            if (review != null) {
                Comment.findById(req.params.comment_id)
                    .then(comment => {
                        console.log(comment);
                        if (comment != null) {
                            Comment.findByIdAndRemove(req.params.comment_id)
                                .then((resp) => {
                                    let index = review.comments.indexOf(resp._id);
                                    if (index > -1) {
                                        review.comments.splice(index, 1)
                                    }
                                    review.save();
                                    req.flash("success", "You successfully deletd comment.")
                                    res.redirect('/reviews/' + req.params.reviewId);
                                })
                                .catch(err => {
                                    console.log('Hello 1', err);
                                    req.flash("error", "Something went wrong !!! ");
                                    res.redirect('/reviews/' + req.params.reviewId);
                                });
                        } else {
                            console.log('Hello 2');
                            req.flash("error", "Something went wrong !!! ");
                            res.redirect('/reviews/' + req.params.reviewId);
                        }
                    })
                    .catch(err => {
                        console.log('Hello 3', err);
                        req.flash("error", "Something went wrong !!! ");
                        res.redirect('/reviews/' + req.params.reviewId);
                    });
            } else {
                console.log('Hello 4');
                req.flash("error", "Something went wrong !!! ");
                res.redirect('/reviews/' + req.params.reviewId);
            }
        })
        .catch(err => {
            console.log('Hello 5', err);
            req.flash("error", "Something went wrong !!! ");
            res.redirect('/reviews/' + req.params.reviewId);
        });
});




module.exports = commentRouter;