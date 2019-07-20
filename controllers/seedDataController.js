const user = require('../models/userModel');
const product = require('../models/productModel');

module.exports = function (app) {

    let seedUsersData = [
        {
            email: 'test@gmail.com',
            password: 'test123',
            role: 'admin'
        }, {
            email: 'abc@gmail.com',
            password: 'abc123',
            role: 'schoonmaker'
        }
    ];


    let seedProductsData = [
        {
            name: 'Pork',
            pricing: '1$',
            category: [{name: 'meat'}]
        },
        {
            name: 'Brocolli',
            pricing: '15$',
            category: [{name: 'vegetable'}]
        },
        {
            name: 'Carrot',
            pricing: '13$',
            category: [{name: 'vegetable'}]
        }

    ];

    app.get('/api/seedData', function (req, res) {

        user.create(seedUsersData, function (err, results) {
            if (err) throw err;
        });

        product.create(seedProductsData, function (err) {
            if (err) throw err;
        });
        res.send(200);
    });
};
