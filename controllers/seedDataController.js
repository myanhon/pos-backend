const user = require('../models/userModel');
const product = require('../models/productModel');

let seedUsersData = [
    {
        name: 'Mike',
        email: 'test@gmail.com',
        password: 'test123',
        role: 'admin'
    }, {
        name: 'Noella',
        email: 'abc@gmail.com',
        password: 'abc123',
        role: 'schoonmaker'
    }
];


let seedProductsData = [
    {
        name: 'Pork',
        price: 12,
        category: [{name: 'meat'}]
    },
    {
        name: 'Brocolli',
        price: 14,
        category: [{name: 'vegetable'}]
    },
    {
        name: 'Carrot',
        price: 15,
        category: [{name: 'vegetable'}]
    }
];

module.exports = function (app) {

    app.get('/api/seedData', function (req, res) {

        user.create(seedUsersData, function (err, results) {
            if (err) throw err;
        });

        product.create(seedProductsData, function (err) {
            if (err) throw err;
        });
        res.sendStatus(200);
    });

    app.get('/api/deleteSeed', function (req, res) {
        user.remove({});
        product.remove({});
        res.send('Collections Emptied');
    });

};


