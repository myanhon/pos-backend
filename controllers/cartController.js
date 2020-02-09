const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const selectString = 'name amount price quantity category';

module.exports = function (app) {
    app.get('/add-to-cart/:id', (req, res) => {
        Product.findById(req.params.id)
            .select(selectString)
            .then(product => {
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not Found'
                    });
                }
                let cart = new Cart(req.session.cart ? req.session.cart : {});
                cart.add(product);
                req.session.cart = cart;
                res.sendStatus(200);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });

    app.get('/reduce-one-from-cart/:id',(req,res) =>{
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.sendStatus(200);
    });

    app.get('/remove-from-cart/:id',(req,res) =>{
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.removeItem(productId);
        req.session.cart = cart;
        res.sendStatus(200);
    });

    app.get('/shopping-cart', (req, res) => {
        if (req.session.cart) {
            const cart = new Cart(req.session.cart);
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
