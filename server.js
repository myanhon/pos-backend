require('dotenv').config();
require('./config/passport-config.js');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const seedDataController = require('./controllers/seedDataController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const orderController = require('./controllers/orderController');
const cartController = require('./controllers/cartController');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session); // instead of default MemoryStorage of the server
const port = process.env.PORT || 3000;
const cors = require('cors');
const flash = require('express-flash');
const passport = require('passport');

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTION');

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(flash());
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

// //check cookie from request
// app.use(function (req, res, next) {
//     console.log('Cookie from request',req.cookies);
//     next();
// });

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();

});
mongoose.connect(config.getDbConnection(),{ useNewUrlParser: true , useUnifiedTopology: true});

productController(app);
userController(app);
orderController(app);
cartController(app);
if(process.env.ENV === "DEV"){
    seedDataController(app);
}
app.listen(port);