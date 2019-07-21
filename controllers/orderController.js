const order = require('../models/orderModel');
const bodyParser = require('body-parser');
const product = require('../models/productModel');
const selectString = 'product quantity';


module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/orders',(req,res)=>{
        order.find()
            .select(selectString)
            .exec()
            .then(docs => {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/api/order/' + doc._id
                            }
                        };
                    })
                });
            }).catch(err => {

            res.status(500).json({
                error: err
            })
        });
    });

    app.get('/api/order/:orderId',function (req,res) {
        order.findById(req.params.orderId)
            .select(selectString)
            .exec()
            .then(order => {
                res.status(200).json({
                    order: order,
                    rquest: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/orders'
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });


    app.post('/api/order', (req, res) => {
        product.findById(req.body.productId)
            .then(product => {
                const newOrder = order({
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                return newOrder.save().catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
            }).then(result => {
            res.status(200).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/api/order/' + result._id
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });

    app.delete('/api/order/:orderId', (req, res) => {
        order.remove({_id: req.params.orderId})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Order Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/api/orders',
                        body: {
                            productId: "ID",
                            quantity: "Number"
                        }
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
};