require('dotenv').config();
require('./config/passport-config.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const config = require('./config/config');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
}

let refreshTokens = []; //not for production
app.post('/login', (req, res) => {
    //Authenticate User
    const email = req.body.email;
    const user = {email: email};

    //Same User
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    console.log('pushed', refreshToken);
    refreshTokens.push(refreshToken);
    res.json({accessToken: accessToken, refreshToken: refreshToken});
});

app.post('/register', check('email', 'Invalid email').notEmpty().isEmail(),
    check('password', 'Invalid password').notEmpty().isLength({min: 4}), (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMsgs = [];
            errors.array().forEach(error => {
                errorMsgs.push(error.msg);
            });
            return res.status(422).json({error: errorMsgs});
        }
        passport.authenticate('local.register',   (err, passportUser, info) => {
            if (!passportUser) return res.json({error: info.message});
            const user =  {email: passportUser.email};
            const accessToken =  generateAccessToken(user);
            //Same User
            const refreshToken =  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken);
            res.json({accessToken: accessToken, refreshToken: refreshToken});
            next();
        })(req, res, next);
    });

app.post('/refreshToken', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //Do we have a valid refreshtoken that exist for this refresh. If it does not exist return err
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({email: user.email});
        res.json({accessToken: accessToken})
    });
});


app.delete('/logout', (req, res) => {
    refreshTokens =  refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

mongoose.connect(config.getDbConnection(),{ useNewUrlParser: true , useUnifiedTopology: true});
app.listen(port);
