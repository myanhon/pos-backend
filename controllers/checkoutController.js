const Cart = require('../models/cartModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
module.exports = function (app) {
    app.get('/api/checkout', (req, res) => {
        if (!req.session.cart ) {
            res.json({
                isActive: false
            });
        }else{
            res.json({
                isActive: true,
            })
        }
    });

    app.post('/api/checkout', (req, res) => {
        if (!req.session.cart) {
            res.json({
                message: "Cart is Empty"
            });
        } else {
            const cart = new Cart(req.session.cart);
            // Token is created using Stripe Checkout or Elements!
            // Get the payment token ID submitted by the form:
            stripe.charges.create({
                amount: cart.totalPrice * 100,
                currency: "USD",
                description: 'Example charge',
                source: req.body,
            }).then(() => {
                console.log('Successfully bought product!');
                req.session.cart = null;
                res.status(200).json({
                    message: 'Successfully bought product!'
                });
            }).catch(error => {
                console.log("error g:", error);
                return res.status(500).json({
                    error: error
                })
            });
        }
    });
};