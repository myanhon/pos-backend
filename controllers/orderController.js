const order = require('../models/orderModel');
const bodyParser = require('body-parser');
const product = require('../models/productModel');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/api/order', (req, res) => {
        const newOrder = order({
            quantity: req.body.quantity,
            product: req.body.productId
        });
        newOrder.save().then(result=>{

            res.status(200).json(result);
        }).catch(err =>{
            res.status(500).json({
                error: err
            })
        })

    });




};