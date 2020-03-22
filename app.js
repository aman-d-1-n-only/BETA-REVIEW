var express = require("express");
var app = express();


var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//mongoose connection
var mongoose = require("mongoose");
var url = "mongodb+srv://imdbduster:1234567895@cluster0-sminu.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongo Db connected"))
    .catch(err => console.log(err));

var MovieInfo = require('./models/movieschema');



//ROUTES TO MOVIE REVIEWS PAGE
app.get("/", function(req, res) {
    MovieInfo.find({}, function(err, movieInfo) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { MovieInfo: movieInfo });
        }


    });
});

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
    MovieInfo.findById(req.params.id, function(err, gotIt) {
        if (err) {
            console.log(err);
        } else {
            res.render("review", { MovieInfo: gotIt });
        }
    })

})



app.listen(process.env.PORT || 3000, function() {
    console.log("Server is listening..");
});