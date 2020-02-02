const Cart = require('../models/cartModel');
const querystring = require('querystring');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
module.exports = function (app) {
    //TODO or not TODO
    app.get('/api/checkout', (req, res,) => {
        if (!req.session.cart) {
            //redirect?
            console.log('get welloe');
            res.send('error');
        }
        console.log('WE FKING MADE IT',req.session.cart);

        const cart = new Cart(req.session.cart);
        res.json({
            totalPrice: cart.totalPrice
        })
    });

    app.post('/api/checkout', (req, res) => {
        if (!req.session.cart) {
            //should redirect
            console.log('geen cart huh?');
            return
        }
        const cart = new Cart(req.session.cart);
        // Token is created using Stripe Checkout or Elements!
       // Get the payment token ID submitted by the form:
        stripe.charges.create({
            amount: cart.totalPrice*100,
            currency: "USD",
            description: 'Example charge',
            source:req.body,
        }).then(() => {
            console.log('Successfully bought product!');
            req.session.cart = null;
            res.status(200).json({
                message: 'Successfully bought product!'
            });
        }).catch(error => {
            // console.log("error g:", error);
            return res.status(500).json({
                error: error
            })
        });

    });
};