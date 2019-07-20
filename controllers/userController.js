const user = require('../models/userModel');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/user/:email', function (req, res) {
        user.findOne({email:req.params.email}, function (err, data) {
            if (err){
                res.sendStatus(500).send('Something broke!');
            }
            res.send(data);
        });
    });

    app.post('/api/user', function (req, res) {
        if (req.body.id) {
            user.findByIdAndUpdate(req.body.id,
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                }, function (err) {
                    if (err){
                        console.log(err);
                        res.sendStatus(500).send('Something broke!')
                    }
                    res.send('Success');
                });
        }
        else {
            let newUser = user({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            newUser.save(function (err) {
                if(err) throw err;
                res.send(200, 'User Saved');
            });
        }
    });

    app.delete('/api/user', function (req, res) {
        user.findByIdAndDelete(req.body.id, function (err) {
            if (err){
                console.log(err);
                res.sendStatus(500).send('Something broke!');
            }
            res.send('Deleted User');
        });
    });

};