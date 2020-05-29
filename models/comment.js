var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating a schema
const commentSchema = new Schema({
    text: String,
    author: String
});

module.exports = mongoose.model('Comment', commentSchema);