const product = require('../models/productModel');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/product/:name', function (req, res) {
        product.findOne({name: req.params.name}, function (err, data) {
            if (err) {
                res.sendStatus(500).send('Something broke!')
            }
            res.send(data);
        });
    });

    app.post('/api/product', function (req, res) {
        if (req.body.id) {
            product.findByIdAndUpdate(req.body.id,
                {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category
                }, function (err) {
                    if (err){
                        console.log(err);
                        res.sendStatus(500).send('Something broke!')
                    }
                    res.send('Updated Product');
                });
        }
        else {
            let newProduct = product({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category
            });
            newProduct.save(function (err) {
                if (err){
                    console.log(err);
                    res.sendStatus(500).send('Something broke!');
                }
                res.send('Product Saved');
            });
        }
    });

    app.delete('/api/product', function (req, res) {
        product.findByIdAndDelete(req.body.id, function (err) {
            if (err){
                console.log(err);
                res.status(500).send('Something broke!');
            }
            res.send('Deleted Product');
        });
    });

};