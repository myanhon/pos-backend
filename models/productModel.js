const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    size: String,
    category: String,
    url:String,
});

module.exports = mongoose.model('Product', productSchema);