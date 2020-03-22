var mongoose = require("mongoose");
//is use to store schema constructor that will be used to make schema
const Schema = mongoose.Schema;

//creating a schema
const movieSchema = new Schema({
    name: String,
    title: String,
    image: String,
    review: String
});

module.exports = mongoose.model('MovieInfo', movieSchema);