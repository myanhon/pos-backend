const User = require('../models/userModel');
const selectString = 'name email password role';
const jwt = require('jsonwebtoken');
const passport = require('passport');

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




    app.post('/user/register', function (req, res, next) {
         passport.authenticate('local.register', function (err, passportUser, info) {
            if (err) return res.json({error: info.message});
            if (!passportUser) return res.json({message: info.message});
             return res.end();
        })(req, res, next);
    });


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


    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; //if we have a authHeader then return authHeader[1]
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next()
        });
    }

};