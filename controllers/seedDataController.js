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
        role: 'Worker'
    }
];


let seedProductsData = [
    {
        name: 'Fish Cutlet',
        price: 12,
        size: "Medium",
        category:  'Fish'
    },
    {
        name: 'Sate ku Batata',
        price: 14,
        size: "Large",
        category:  'Meat'
    },
    {
        name: 'Coco Cola',
        price: 15,
        amount: 5,
        category: 'Cold Drinks'
    }
];

module.exports = function (app,mongoose) {

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

        mongoose.connection.collections['users'].drop(() => {
            console.log('users dropped');
        });

        mongoose.connection.collections['products'].drop(() => {
            console.log('products dropped');
        });

        mongoose.connection.collections['orders'].drop(() => {
            console.log('orders dropped');
        });
        res.send('Collections Emptied');
    });

};


