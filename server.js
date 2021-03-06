require('dotenv').config();
require('./config/passport-config.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const configDB = require('./config/configDB');
const seedDataController = require('./controllers/seedDataController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const orderController = require('./controllers/orderController');
const cartController = require('./controllers/cartController');
const checkOutController = require('./controllers/checkoutController');
const configHeader = require('./config/config-headers');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session); // instead of default MemoryStorage of the server
const port = process.env.PORT || 3000;
const passport = require('passport');

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(express.static('public'));

// Add headers
app.use(function (req, res, next) {
    configHeader.setHeaders(req, res, next);
});

configDB.getDbConnection();

app.use(session({
    secret: process.env.SESSION_SECRET,
    httpOnly: true, // dont let browser javascript access cookie ever
    resave: false, // Should we resave our session variables if nothing has changed
    saveUninitialized: false, // Do you want to save empty values?
    store: new MongoStore({
        mongooseConnection: mongoose.connection // use existed mongoose connection instead of a new one
    }),
    cookie: {maxAge: 180 * 60 * 1000} //How long a session should live
}));
app.use(passport.initialize());
app.use(passport.session());

//check cookie from request
app.use(function (req, res, next) {
    //console.log('server check user',req.user);
    next();
});

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
console.log('process.env.POS_FRONTEND_URL:', process.env.POS_FRONTEND_URL);
productController(app);
userController(app);
orderController(app);
cartController(app);
checkOutController(app);
if(process.env.STATUS === "DEV"){
    seedDataController(app);
}
app.listen(port);