const mongoose = require('mongoose');
const users  = require('./userModel');
const products = require('./productModel');

const mainSchema = new mongoose.Schema({
    users: [users],
    products: [products]
},{collection:'products'});

const main = mongoose.model('Main', mainSchema);

module.exports = main;

