var mongoose = require('mongoose');

userSchema = mongoose.Schema({
    username: String,
    password: String,
    dataset: String
});

module.exports = mongoose.model('User', userSchema);