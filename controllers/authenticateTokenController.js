const jwt = require('jsonwebtoken');
const authenticateToken = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //if we have a authHeader then return authHeader[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        next();
    });
};

module.exports = authenticateToken;