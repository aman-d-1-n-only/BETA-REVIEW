var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');


//movie schema connection
var MovieInfo = require('./models/movieschema');

//comments schema
var Comment = require('./models/comment')

//user schema connection
var User = require('./models/user');

//seed.js file
var seedDB = require('./seed')
seedDB();

//mongoose connection
var mongoose = require("mongoose")
var url = "mongodb+srv://imdbduster:1234567895@cluster0-sminu.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongo Db connected"))
    .catch(err => console.log(err));

var app = express();
app.set("view engine", "ejs");

app.use(require('express-session')({
    secret: "Nauruto Uzumaki Jiraya Rasen Shuriken best",
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES TO MOVIE REVIEWS PAGE
app.get("/", function(req, res) {

    MovieInfo.find({}, function(err, movieInfo) {
        if (err) {
            console.log(err);
        } else {
            res.render("MovieReviews/index", { MovieInfo: movieInfo, currentUser: req.user });
        }


    });
});

//sign-up page route
app.get('/register', function(req, res) {
    res.render('register')
})

//sign-up POST route
app.post('/register', function(req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/')
        })
    })
})

//login page route
app.get('/login', function(req, res) {
    res.render('login')
})

//login POST route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}), function(req, res) {

})

//log out route
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/')

})

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

//form for adding review
app.get("/moviereviews/form", isLoggedIn, function(req, res) {
    res.render("MovieReviews/new");
});

//POST route of form for adding review
app.post("/moviereviews", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var title = req.body.title;
    var image = req.body.url;
    var review = req.body.review;
    MovieInfo.create({
            name: name,
            title: title,
            image: image,
            review: review
        },

        function(err, MovieInfo) {
            if (err) {
                console.log(err);
            } else {
                console.log(MovieInfo);
            }
            //redirect to movie review page 
            res.redirect("/");
        });
});




// show page for each review
app.get("/moviereviews/:id", function(req, res) {
    MovieInfo.findById(req.params.id).populate('comments').exec(function(err, review) {
        if (err) {
            console.log(err);
        } else {
            console.log(review)
            res.render("MovieReviews/show", { MovieInfo: review });
        }
    })

})

//comments form route
app.get('/moviereviews/:id/comments/new', isLoggedIn, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, review) {
        if (err) {
            console.log(err)
        } else {
            res.render("Comments/new", { MovieInfo: review });
        }
    })

})

//comments POST route
app.post('/moviereviews/:id/comments', isLoggedIn, function(req, res) {
    MovieInfo.findById(req.params.id, function(err, movie) {
        if (err) {
            console.log(err)
            res.redirect('/')
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

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is listening..");
});