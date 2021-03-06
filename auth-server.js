require('dotenv').config();
require('./config/passport-config.js');
const RefreshToken = require('./models/refreshTokenModel');
const authenticateToken = require('./controllers/authenticateTokenController');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const configDB = require('./config/configDB');
const User = require('./models/userModel');
const session = require('express-session');
const configHeader = require('./config/config-headers');
const MongoStore = require('connect-mongo')(session); // instead of default MemoryStorage of the server
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(function (req, res, next) {
  configHeader.setHeaders(req, res, next);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    httpOnly: true, // dont let browser javascript access cookie ever
    resave: false, // Should we resave our session variables if nothing has changed
    saveUninitialized: false, // Do you want to save empty values?
    store: new MongoStore({
      mongooseConnection: mongoose.connection, // use existed mongoose connection instead of a new one
    }),
    cookie: { maxAge: 180 * 60 * 1000 }, //How long a session should live
  })
);

app.use(passport.initialize());
app.use(passport.session());

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

app.post(
  '/login',
  check('email', 'Invalid email').notEmpty().isEmail(),
  check('password', 'Invalid password').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgs = [];
      errors.array({ onlyFirstError: true }).forEach((error) => {
        errorMsgs.push(error.msg);
      });
      return res.status(422).json({ message: errorMsgs });
    }

    passport.authenticate('local.login', (err, passportUser, info) => {
      if (!passportUser) return res.status(400).json({ message: info.message });
      //Authenticate User
      const email = req.body.email;
      const user = { email: email };

      //Same User
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      const newRefreshToken = new RefreshToken({
        refreshToken: refreshToken,
      });

      newRefreshToken.save().then(() => {
        req.login(passportUser, function (err) {
          if (err) {
            console.log(err);
          }
          res.json({ accessToken: accessToken, refreshToken: refreshToken, user:passportUser });
          next();
        });
      })
    })(req, res, next);
  }
);

app.post(
  '/register',
  check('email', 'Invalid email')
    .notEmpty()
    .isEmail()
    .custom((email) => {
      return User.findOne({ email: email }).then((user) => {
        if (user) {
          return Promise.reject('Email already in use');
        }
      });
    }),
  check('password', 'Invalid password').notEmpty().isLength({ min: 4 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsgs = [];
      errors.array({ onlyFirstError: true }).forEach((error) => {
        errorMsgs.push(error.msg);
      });
      return res.status(422).json({ message: errorMsgs });
    }
    passport.authenticate('local.register', (err, passportUser, info) => {
      if (!passportUser) return res.status(400).json({ message: info.message });
      const user = { email: passportUser.email };
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      const newRefreshToken = new RefreshToken({
        refreshToken: refreshToken,
      });
      newRefreshToken.save().then(() => {
        req.login(passportUser, function (err) {
          if (err) {
            console.log(err);
          }
          res.json({ accessToken: accessToken, refreshToken: refreshToken , user:passportUser });
          next();
        });
      });
    })(req, res, next);
  }
);

app.post('/refreshToken', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  RefreshToken.findOne({ refreshToken: req.body.refreshToken })
    .select('refreshToken')
    .exec()
    .then((result) => {
      if (!result) return res.sendStatus(403); //Do we have a valid refreshtoken that exist for this refresh. If it does not exist return err
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
      });
    });
});

app.post('/verify', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

app.delete('/logout', (req, res) => {
  req.logout();
  RefreshToken.findOneAndDelete({ refreshToken: req.body.refreshToken })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Delete RefreshToken',
      });
    })
    .catch((err) => {
      res.send(500).json({
        error: err,
      });
    });
});

configDB.getDbConnection();
app.use(function (req, res, next) {
  //console.log('authServer check user', req.user);
  next();
});

app.listen(port);
