const user = require('../models/userModel');
const product = require('../models/productModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let seedUsersData = [
    {
        name: 'Mike',
        email: 'test@gmail.com',
        password:  bcrypt.hashSync('test', 10),
        role: 'admin'
    }, {
        name: 'Noella',
        email: 'abc@gmail.com',
        password:  bcrypt.hashSync('test', 10),
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
        name: 'Coca Cola',
        price: 1.50,
        size: "Large",
        category: 'Cold Drinks',
        productImage:'/coca-cola.jpg'
    },
    {
        name: 'Fanta',
        price: 1.50,
        size: "Large",
        category: 'Cold Drinks',
        productImage:'/fanta.png'
    },
    {
        name: 'Sprite',
        price: 1.50,
        size: "Large",
        category: 'Cold Drinks',
        productImage:'/sprite.jpg'
    },
    {
        name: 'Glou Glou',
        price: 15,
        category: 'Wine'
    }
];

module.exports = function (app) {

    app.get('/seedData', function (req, res) {
        user.create(seedUsersData, function (err) {
            if (err) throw err;
        });
        product.create(seedProductsData, function (err) {
            if (err) throw err;
        });
        res.sendStatus(200);
    });

    app.get('/deleteSeed', function (req, res) {
        mongoose.connection.db.dropDatabase(function(err) {
            if (err) throw err;
            res.sendStatus(200);
        });
    });

};


