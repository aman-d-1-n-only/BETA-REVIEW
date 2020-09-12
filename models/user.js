var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')


//creating a schema
var userSchema = new Schema({
    region: {
        type: String,
        default: ''
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);