const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const seedDataController = require('./controllers/seedDataController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

const port = process.env.PORT || 3000;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

mongoose.connect(config.getDbConnectionUsers(),{ useNewUrlParser: true });
mongoose.connect(config.getDbConnectionProducts(),{ useNewUrlParser: true });

productController(app);
userController(app);
seedDataController(app);
app.listen(port);