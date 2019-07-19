const index = require('../models/index');


const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/user/:email', function (req, res) {
        index.findOne({'users.email': req.params.email}, function (err, index) {
                if (err) throw err;
                res.send(index);
            }).select('users.$');

    });
};