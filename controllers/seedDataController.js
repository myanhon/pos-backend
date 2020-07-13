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

let seedProductsData = [
  {
    name: 'Fish Cutlet',
    price: 5.50,
    size: 'Small',
    category: 'Dinner',
    productImage: '/fish-cutlet.jpg',
  },
  {
    name: 'Fish Cutlet',
    price: 10,
    size: 'Medium',
    category: 'Dinner',
    productImage: '/fish-cutlet.jpg',
  },
  {
    name: 'Fish Cutlet',
    price: 12,
    size: 'Large',
    category: 'Dinner',
    productImage: '/fish-cutlet.jpg',
  },
  {
    name: 'Sate ku Batata',
    price: 6,
    size: 'Large',
    category: 'Dinner',
    productImage: '/sate-ku-batata.jpg',
  },
  {
    name: 'Sate ku Batata',
    price: 9.50,
    size: 'Large',
    category: 'Dinner',
    productImage: '/sate-ku-batata.jpg',
  },
  {
    name: 'Sate ku Batata',
    price: 14,
  
    size: 'Large',
    category: 'Dinner',
    productImage: '/sate-ku-batata.jpg',
  },
  {
    name: 'Hamburger',
    price: 2.50,
    size: 'Small',
    category: 'Lunch',
    productImage: '/hamburger.jpg',
  },
  {
    name: 'Hamburger',
    price: 3,
    size: 'Medium',
    category: 'Lunch',
    productImage: '/hamburger.jpg',
  },
  {
    name: 'Hamburger',
    price: 6,
    size: 'Large',
    category: 'Lunch',
    productImage: '/hamburger.jpg',
  },
  {
    name: 'Sandwich',
    price: 2.50,
    size: 'Small',
    category: 'Lunch',
    productImage: '/sandwich.jpg',
  },
  {
    name: 'Sandwich',
    price: 3,
    size: 'Medium',
    category: 'Lunch',
    productImage: '/sandwich.jpg',
  },
  {
    name: 'Sandwich',
    price: 6,
    size: 'Large',
    category: 'Lunch',
    productImage: '/sandwich.jpg',
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
    name: 'Tea',
    price: 1.50,
    size: 'Small',
    category: 'Hot Drinks',
    productImage: '/tea.jpg',
  },
  {
    name: 'Tea',
    price: 2,
    size: 'Medium',
    category: 'Hot Drinks',
    productImage: '/tea.jpg',
  },
  {
    name: 'Tea',
    price: 2.2,
    size: 'Large',
    category: 'Hot Drinks',
    productImage: '/tea.jpg',
  },
  {
    name: 'Glou Glou',
    price: 4,
    size: 'Small',
    category: 'Alcohol',
    productImage: '/glou-glou.jpg',
  },
  {
    name: 'Glou Glou',
    price: 22,
    size: 'Large',
    category: 'Alcohol',
    productImage: '/glou-glou.jpg',
  },
  {
    name: 'Amstel',
    price: 2.50,
    size: 'Small',
    category: 'Alcohol',
    productImage: '/amstel.jpg',
  },
  {
    name: 'Heineken',
    price: 2.50,
    size: 'Small',
    category: 'Alcohol',
    productImage: '/heineken.jpg',
  },
  {
    name: 'Hertog-jan',
    price: 2.50,
    size: 'Small',
    category: 'Alcohol',
    productImage: '/hertog-jan.jpg',
  },
  {
    name: 'Garnacha',
    price: 4.50,
    size: 'Small',
    category: 'Alcohol',
    productImage: '/garnacha.jpg',
  },
  {
    name: 'Garnacha',
    price: 25,
    size: 'Large',
    category: 'Alcohol',
    productImage: '/garnacha.jpg',
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
