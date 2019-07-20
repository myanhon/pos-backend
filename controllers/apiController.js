const users = require('../models/userModel');
const product = require('../models/productModel');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/user/:email', function (req, res) {
        users.findOne({email:req.params.email}, function (err, data) {
                        if (err){
                            console.error(err.stack);
                            res.status(500).send('Something broke!')
                        }
                        res.send(data);
        });
    });

    app.post('/api/user', function (req, res) {
        console.log(req.body);
        if (req.body.id) {
            users.findByIdAndUpdate(req.body.id,
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                }, function (err) {
                    if (err) throw err;

                    res.send('Success');

                });
        }
        else {
            let newUser = users({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            newUser.save(function (err) {
                if(err) throw err;
                res.send(200,'User Saved')
            });
        }
    });

    app.delete('/api/user', function (req, res) {
        users.findByIdAndDelete(req.body.id, function (err) {
            if (err) throw err;
            res.send('Deleted User')
        });
    });

    app.get('/api/product/:name', function (req, res) {
        product.findOne({name: req.params.name}, function (err, data) {
            if (err) {
                console.error(err.stack);
                res.status(500).send('Something broke!')
            }
            res.send(data);
        });
    });

};