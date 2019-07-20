const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    role: String,
});

let users = mongoose.model('User',userSchema);
module.exports = users;
