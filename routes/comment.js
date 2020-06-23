var express = require('express');
var router = express.Router({ mergeParams: true });
var Comment = require('../models/comment')
var MovieInfo = require('../models/movieschema')
var middleware = require('../middleware/index')

//comments form route
router.get('/new', middleware.isLoggedIn, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, review) {
        if (err) {
            console.log(err)
        } else {
            res.render("Comments/new", { MovieInfo: review });
        }
    })

})

//comments POST route
router.post('/', middleware.isLoggedIn, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, movie) {
        if (err) {
            console.log(err)
            res.redirect('/moviereviews')
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
                    res.redirect('/moviereviews/' + movie._id)
                }
            })
        }
    })
})

//Comment Edit Route
router.get("/:comment_id/edit", middleware.commentAuthorization, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render('Comments/edit', { MovieInfo_id: req.params.id, comment: foundComment });
        }
    });

})

//Comment Update Route
router.put("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/moviereviews/' + req.params.id);
        }
    })
})

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/moviereviews/' + req.params.id);
        }
    })
})




module.exports = router;