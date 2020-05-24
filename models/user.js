var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose')
    //is use to store schema constructor that will be used to make schema
const Schema = mongoose.Schema;

//creating a schema
const userSchema = new Schema({
    username: String,
    password: String,

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);