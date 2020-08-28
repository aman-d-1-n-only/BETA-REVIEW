//Node Modules
var express = require("express");
var path = require('path');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var methodOverride = require('method-override');
var flash = require('connect-flash');
var axios = require('axios');

//Routes
var reviewRouter = require("./routes/reviewRouter");
var commentRouter = require("./routes/commentRouter");
var userRouter = require("./routes/userRouter");

//Dependencies File
var config = require('./config');
var authenticate = require('./authenticate');
var need = require('./need');

//Model 
var MovieInfo = require('./models/review');
var Comment = require('./models/comment')
var User = require('./models/user');

//mongoose connection
var url = config.mongoUrl;
var connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
connect
    .then((db) => {
        console.log("Connected to database");
    })
    .catch(err => console.log(err));

var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    name: 'session-id',
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false,
    // store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('main', { treMovies: need.treMovies, treShows: need.treShows });
});

app.use('/reviews', reviewRouter);
app.use('/', userRouter);
app.use('/reviews/:reviewId/comments', commentRouter);

app.listen(process.env.PORT || 8337, function() {
    console.log('Connected to server successfully.');
});