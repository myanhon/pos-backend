const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    amount: Number,
    price: Number,
    category: [{name:String}]
});

module.exports = mongoose.model('Product', productSchema);