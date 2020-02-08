const Cart = require('../models/cartModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Order = require('../models/orderModel');
module.exports = function (app) {
    app.get('/checkout', (req, res) => {
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

    app.post('/checkout',(req, res) => {
        console.log("req url: ", req.url);
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
                source: req.body.stripeToken,
            }).then( charge => {

                const order = new Order({
                    //req.user through passport
                    user: req.user,
                    cart: cart,
                    name: req.body.name,
                    paymentId: charge.id
                });

                order.save().then(() => {
                    console.log('we zijn binnen', order);
                    req.session.cart = null;
                    res.status(200).json({
                        message: 'Successfully bought product!'
                    });
                });
            }).catch(error => {
                console.log("error:", error.message);
                return res.status(500).json({
                    error: error.message
                })
            });
        }
    });
};