const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    name: String,
    email: {type: String},
    password: String,
    role: String,
});

userSchema.plugin(mongooseUniqueValidator);
module.exports =  mongoose.model('User',userSchema);
