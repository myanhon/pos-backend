const user = require('../models/userModel');
const product = require('../models/productModel');
const refreshtoken = require('../models/refreshTokenModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let seedUsersData = [
  {
    name: 'Mike',
    email: 'test@gmail.com',
    password: bcrypt.hashSync('test', 10),
    role: 'admin',
  },
  {
    name: 'Noella',
    email: 'abc@gmail.com',
    password: bcrypt.hashSync('test', 10),
    role: 'Worker',
  },
];
let refreshTokenSeedData = [
  {
    refreshToken: '1234',
  },
];
let seedProductsData = [
  {
    name: 'Fish Cutlet',
    price: 12,
    size: 'Medium',
    category: 'Fish',
    productImage: '/fish-cutlet.jpg',
  },
  {
    name: 'Sate ku Batata',
    price: 14,
    size: 'Large',
    category: 'Meat',
    productImage: '/sate-ku-batata.jpg',
  },
  {
    name: 'Coca Cola',
    price: 1.5,
    size: 'Large',
    category: 'Cold Drinks',
    productImage: '/coca-cola.jpg',
  },
  {
    name: 'Fanta',
    price: 1.5,
    size: 'Large',
    category: 'Cold Drinks',
    productImage: '/fanta.png',
  },
  {
    name: 'Sprite',
    price: 1.5,
    size: 'Large',
    category: 'Cold Drinks',
    productImage: '/sprite.jpg',
  },
  {
    name: 'Coca Cola',
    price: 1,
    size: 'Small',
    category: 'Cold Drinks',
    productImage: '/coca-cola.jpg',
  },
  {
    name: 'Fanta',
    price: 1,
    size: 'Small',
    category: 'Cold Drinks',
    productImage: '/fanta.png',
  },
  {
    name: 'Sprite',
    price: 1,
    size: 'Small',
    category: 'Cold Drinks',
    productImage: '/sprite.jpg',
  },
  {
    name: 'Coffee',
    price: 1.50,
    size: 'Small',
    category: 'Hot Drinks',
    productImage: '/coffee.jpg',
  },
  {
    name: 'Coffee',
    price: 2,
    size: 'Medium',
    category: 'Hot Drinks',
    productImage: '/coffee.jpg',
  },
  {
    name: 'Coffee',
    price: 2.2,
    size: 'Large',
    category: 'Hot Drinks',
    productImage: '/coffee.jpg',
  },
  {
    name: 'Glou Glou',
    price: 15,
    size: 'Large',
    category: 'Wine',
    productImage: '/glou-glou.jpg',
  },
];

module.exports = function (app) {
  app.get('/seed', function (req, res) {
    user.create(seedUsersData, function (err) {
      if (err) throw err;
    });
    product.create(seedProductsData, function (err) {
      if (err) throw err;
    });
    refreshtoken.create(refreshTokenSeedData, function (err) {
      if (err) throw err;
    });
    res.sendStatus(200);
  });

  app.get('/seedDelete', function (req, res) {
    mongoose.connection.db.dropDatabase(function (err) {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
};
