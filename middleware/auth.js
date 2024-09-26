const jwt = require('jsonwebtoken');

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    let token = req.header('Authorization');

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = auth;