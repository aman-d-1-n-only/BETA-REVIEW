var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating a schema
const commentSchema = new Schema({
    comment: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
});

module.exports = mongoose.model('Comment', commentSchema);