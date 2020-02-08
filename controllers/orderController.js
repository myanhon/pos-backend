const Order = require('../models/orderModel');
const selectString = 'user cart name paymentId ';


module.exports = function (app) {
    app.get('/orders',(req,res)=>{
        Order.find()
            .select(selectString)
            .exec()
            .then(docs => {
                res.status(200).json(docs);
            }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
    });

    app.get('/order/:orderId',function (req,res) {
        Order.findById(req.params.orderId)
            .select(selectString)
            .exec()
            .then(order => {
                res.status(200).json({
                    order: order,
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });


    app.post('/order', (req, res) => {
        let newOrder = new Order({
            user: req.user,
            cart: req.session.cart
        });

        newOrder.save()
            .then(()=>{
                res.status(200).json({message: 'Order Saved'});
                // res.session.cart = null;
            })
            .catch(err => {
                res.json({
                    error: err
                });
            });
    });

    app.delete('/order/:orderId', (req, res) => {
        Order.remove({_id: req.params.orderId})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Order Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/orders',
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