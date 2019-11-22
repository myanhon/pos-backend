const User = require('../models/userModel');
const bodyParser = require('body-parser');
const selectString = 'name email password role';

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/users',(req,res)=>{
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

    app.get('/api/users/:email', (req, res) => {
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

    app.post('/api/user', (req, res) => {
        if (req.body._id) {
            User.findByIdAndUpdate(req.body._id, {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }).exec()
                .then(doc => {
                    res.status(200).json({
                        message: 'User updated'
                    });
                }).catch(err => {

                res.status(500).json({
                    error: err
                });
            });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            newUser.save()
                .then(
                    res.status(200).json({
                        message: 'User saved'
                    }))
                .catch(err => {
                    res.send(500).json({
                        error: err
                    });
                });
        }
    });


    app.delete('/api/user', (req, res) => {
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

};