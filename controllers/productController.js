const Product = require('../models/productModel.js');
const selectString = 'name amount price size category';

module.exports = function (app) {

    app.get('/api/products',(req,res)=>{
        Product.find().select(selectString)
            .exec()
            .then(
                docs => {
                    res.status(200).json(docs);
                })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });

    app.get('/api/products/:name', (req, res) => {
        Product.findOne({name: req.params.name})
            .select(selectString)
            .exec()
            .then(
                product => {
                    if (!product) {
                        return res.status(404).json({
                            message: 'Product not found'
                        });
                    }
                    res.status(200).json(product);
                })
            .catch(err => {

                res.status(500).json({
                    error: err
                });
            });
    });


    app.post('/api/product', (req, res) => {
        if (req.body._id) {
            Product.findByIdAndUpdate(req.body._id, {
                name: req.body.name,
                amount:req.body.amount,
                price: req.body.price,
                size:req.body.size,
                category: req.body.category
            })
                .exec()
                .then(doc => {
                    res.status(200).json({
                        message: 'Product updated'
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        } else {
            const newProduct = new Product({
                name: req.body.name,
                amount:req.body.amount,
                price: req.body.price,
                size:req.body.size,
                category: req.body.category
            });
            newProduct.save()
                .then(
                    res.status(200).json({
                        message: 'Product saved'
                    })
                )
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        }
    });

    app.delete('/api/product', (req, res) => {
        Product.remove({_id: req.body._id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Product deleted'
                });
            })
            .catch(err => {
                res.send(500).json({
                    error: err
                });
            });
    });
};