const User = require('../models/userModel');
const selectString = 'name email password role';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
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

    function generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
    }

    let refreshTokens = []; //not for production
    app.post('/api/login',
        check('email', 'Invalid email').notEmpty().isEmail(),
        check('password', 'Invalid password').notEmpty(), (req, res, next) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMsgs = [];
                errors.array({onlyFirstError: true}).forEach(error => {
                    errorMsgs.push(error.msg);
                });
                return res.status(422).json({message: errorMsgs});
            }

            passport.authenticate('local.login', (err, passportUser, info) => {
                if (!passportUser) return res.status(400).json({message: info.message});
                //Authenticate User
                const email = req.body.email;
                const user = {email: email};

                //Same User
                const accessToken = generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken);
                res.json({accessToken: accessToken, refreshToken: refreshToken});
                next();
            })(req, res, next);
        });

    app.post('/api/register',
        check('email', 'Invalid email').notEmpty().isEmail().custom((email =>{
            return User.findOne({email:email}).then(user => {
                if (user) {
                    return Promise.reject('Email already in use');
                }
            });
        })),
        check('password', 'Invalid password').notEmpty().isLength({min: 4}), (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMsgs = [];
                errors.array({onlyFirstError: true}).forEach(error => {
                    errorMsgs.push(error.msg);
                });
                return res.status(422).json({message: errorMsgs});
            }
            passport.authenticate('local.register', (err, passportUser, info) => {
                if (!passportUser) return res.status(400).json({message: info.message});
                const user = {email: passportUser.email};
                const accessToken = generateAccessToken(user);
                //Same User
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken);
                res.json({accessToken: accessToken, refreshToken: refreshToken});
                next();
            })(req, res, next);
        });

    app.post('/api/refreshToken', (req, res) => {
        const refreshToken = req.body.refreshToken;
        if(refreshToken == null) return res.sendStatus(401);
        if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //Do we have a valid refreshtoken that exist for this refresh. If it does not exist return err
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403);
            const accessToken = generateAccessToken({email: user.email});
            res.json({accessToken: accessToken})
        });
    });

    app.post('/verify',authenticateToken, (req, res) => {
        res.sendStatus(200);
    });


    app.delete('/logout', (req, res) => {
        req.logout();
        refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
        res.sendStatus(204);
    });

};