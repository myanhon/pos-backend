const mongoose = require('mongoose');
const users  = require('./userModel');
const products = require('./productModel');



const indexSchema = new mongoose.Schema({
    users: [users],
    products: [products]
},{collection:'products'});

let objects = mongoose.model('Index', indexSchema);


module.exports = objects;

