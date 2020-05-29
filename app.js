var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    //movie schema connection
    MovieInfo = require('./models/movieschema'),
    //user schema connection
    User = require('./models/user'),
    seedDB = require('./seed')


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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES TO MOVIE REVIEWS PAGE
app.get("/", isLoggedIn, function(req, res) {

    MovieInfo.find({}, function(err, movieInfo) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { MovieInfo: movieInfo });
        }


    });
});

//sign-up page route
app.get('/register', function(req, res) {
    res.render('register')
})

//handling the user sign up
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

//login handling logic
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


//ROUTES TO WHICH DATA IS POSTED FROM FORM
app.post("/moviereviews", function(req, res) {
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


//FORM ROUTES
app.get("/moviereviews/form", function(req, res) {
    res.render("form");
});

//review page
app.get("/moviereviews/:id", function(req, res) {
    MovieInfo.findById(req.params.id).populate("comments").exec(function(err, gotIt) {
        if (err) {
            console.log(err);
        } else {
            console.log(gotIt)
            res.render("review", { MovieInfo: gotIt });
        }
    })

})



app.listen(process.env.PORT || 3000, function() {
    console.log("Server is listening..");
});