var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

var moviereviewsRoutes = require("./routes/movieReviews"),
    commentRoutes = require("./routes/comment"),
    authRoutes = require("./routes/auth");

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

app.use("/moviereviews", moviereviewsRoutes);
app.use(authRoutes);
app.use('/moviereviews/: id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is listening..");
});