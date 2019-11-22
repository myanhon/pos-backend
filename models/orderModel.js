const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderItems: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        amount: Number
    }]
});


module.exports = mongoose.model('Order',orderSchema);


