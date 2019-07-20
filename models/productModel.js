const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String
});

const productSchema = new Schema({
    name: String,
    price: String,
    category: [categorySchema],
});

let products = mongoose.model('Product', productSchema);

module.exports = products;