const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    size: String,
    category: String,
    productImage: String
});

module.exports = mongoose.model('Product', productSchema);