const mainSchema = require('../models/mainSchema');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/user/:email', function (req, res) {
        mainSchema.findOne({'users.email': req.params.email}, function (err, index) {
                if (err){
                    console.error(err.stack);
                    res.status(500).send('Something broke!')
                }
                res.send(index);
            }).select('users.$');
    });
};