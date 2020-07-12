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
        console.log("STRIPE_SECRET: ", process.env.STRIPE_SECRET);
        console.log("req_user: ", req.user._id);
        if (!req.session.cart) {
            res.json({
                message: "Cart is Empty"
            });
        } else {
            const cart = new Cart(req.session.cart);
            // Token is created using Stripe Checkout or Elements!
            // Get the payment token ID submitted by the form:
            stripe.charges.create({
                amount: cart.totalPrice.toFixed(2) * 100,
                currency: "USD",
                description: 'Example charge',
                source: req.body.stripeToken,
            }).then( charge => {
                const order = new Order({
                    //req.user through passport
                    user: req.user._id,
                    cart: cart,
                    name: req.body.name,
                    address: req.body.address,
                    paymentId: charge.id
                });

                order.save().then(() => {
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