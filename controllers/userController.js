const User = require('../models/userModel');
const selectString = 'name email password role';
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const authenticateToken = require('./authenticateTokenController');

module.exports = function (app) {
    app.get('/users', (req, res) => {
        User.find()
            .select(selectString)
            .exec()
            .then(docs => {
                res.status(200).json(docs);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });

    app.get('/user/orders', authenticateToken,(req, res) => {
        console.log("orders req.user", req.user)
        Order.find({user: req.user._id})
            .sort({date:-1})
            .then(orders =>{
                orders.forEach(order => {
                    const cart = new Cart(order.cart);
                    order.items = cart.generateCart();
                });
                res.status(200).json({
                    orders: orders
                })
            })
            .catch(error=>{
                res.status(500).json({
                    error: error
                })
            })
    });

    app.get('/users/:email', (req, res) => {
        User.findOne({email: req.params.email})
            .select(selectString)
            .exec()
            .then(
                user => {
                    if (!user) {
                        return res.status(404).json({
                            message: 'User not found'
                        });
                    }
                    res.status(200).json(user);
                })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
    });

    // app.post('/user', (req, res) => {
    //     if (req.body._id) {
    //         User.findByIdAndUpdate(req.body._id, {
    //             name: req.body.name,
    //             email: req.body.email,
    //             password: req.body.password,
    //             role: req.body.role
    //         }).exec()
    //             .then(doc => {
    //                 res.status(200).json({
    //                     message: 'User updated'
    //                 });
    //             }).catch(err => {
    //
    //             res.status(500).json({
    //                 error: err
    //             });
    //         });
    //     } else {
    //         const newUser = new User({
    //             name: req.body.name,
    //             email: req.body.email,
    //             password: req.body.password,
    //             role: req.body.role
    //         });
    //         newUser.save()
    //             .then(
    //                 res.status(200).json({
    //                     message: 'User saved'
    //                 }))
    //             .catch(err => {
    //                 res.send(500).json({
    //                     error: err
    //                 });
    //             });
    //     }
    // });


    app.delete('/user', (req, res) => {
        User.remove({_id: req.body._id}).exec().then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        }).catch(err => {
            res.send(500).json({
                error: err
            });
        });
    });



    // app.post('/user/login', passport.authenticate('local.login'), (req, rex, next) => {
    //
    //
    // });

    //
    // app.post('/user/register', async (req, res) => {
    //     try {
    //         const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //         const newUser = new User({
    //             name: req.body.name,
    //             email: req.body.email,
    //             password: hashedPassword,
    //             role: req.body.role
    //         });
    //         newUser.save()
    //             .then(
    //                 res.status(200).json({
    //                     message: 'User saved',
    //                     user:newUser
    //                 }))
    //             .catch(err => {
    //                 res.send(500).json({
    //                     error: err
    //                 });
    //             });
    //     } catch (err) {
    //         res.send(500).json({
    //             error: err
    //         })
    //     }
    //     //  res.send('jwt was required to get here');
    // });

};