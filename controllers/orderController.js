const Order = require('../models/orderModel');
const bodyParser = require('body-parser');
const selectString = 'user cart';


module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/orders',(req,res)=>{
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

    app.get('/api/order/:orderId',function (req,res) {
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


    app.post('/api/order', (req, res) => {
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

    app.delete('/api/order/:orderId', (req, res) => {
        Order.remove({_id: req.params.orderId})
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