const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    name: {type: String, required: true},
    address:{type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model("Order",orderSchema,"order");


