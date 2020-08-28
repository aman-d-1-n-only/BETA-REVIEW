var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating a schema
const reviewSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    tmdb_id: {
        type: Number
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);