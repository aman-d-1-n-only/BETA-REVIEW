var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating a schema
const commentSchema = new Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
});

module.exports = mongoose.model('Comment', commentSchema);