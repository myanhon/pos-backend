const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: String,
    email: {type: String},
    password: String,
    role: String,
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

userSchema.plugin(mongooseUniqueValidator);
module.exports =  mongoose.model('User',userSchema);
