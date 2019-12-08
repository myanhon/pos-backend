require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000;
app.use(express.json());

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}

let refreshTokens = []; //not for production
app.post('/user/login', (req, res) => {
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


app.post('/user/refreshToken', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403); //Do we have a valid refreshtoken that exist for this refresh. If it does not exist return err
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({email: user.email});
        res.json({accessToken: accessToken})
    });
});


app.delete('/user/logout', (req, res) => {
    refreshTokens =  refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

app.listen(port);
