const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const bodyParser = require('body-parser');
const selectString = 'name amount price quantity category';

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/add-to-cart/:id', (req, res) => {
        Product.findById(req.params.id)
            .select(selectString)
            .then(product => {
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not Found'
                    });
                }
                let cart = new Cart(req.session.cart ? req.session.cart : {});
                cart.add(product, product.id);
                req.session.cart = cart;
                console.log(req.session.cart);
                res.json(req.session.cart);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });

    });

    app.get('/api/shopping-cart', (req, res) => {
        if (req.session.cart) {
            let cart = new Cart(req.session.cart);
            res.json({
                products: cart.generateCart(),
                totalPrice: cart.totalPrice
            });
        }
        else{
            res.json({
                products: null
            });
        }
    });
};
