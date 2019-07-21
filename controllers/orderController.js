const order = require('../models/orderModel');
const bodyParser = require('body-parser');
const product = require('../models/productModel');
const selectString = 'product quantity';


module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/orders',(req,res)=>{
        order.find().select(selectString).exec().then(docs =>{
            res.status(200).json({
                count:docs.length,
                orders: docs.map(doc =>{
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request:{
                            type: 'GET',
                            url: 'http://localhost:3000/api/orders' + doc
                        }
                    };
                })
            });
        }).catch(err =>{
            res.status(500).json({
                error: err
            })
        })
    });

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