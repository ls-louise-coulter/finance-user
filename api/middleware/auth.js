const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('token');
    //401 Unauthorised
    if (!token) return res.status(401).send('Access Denied. No token provided.');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
//        res.send(user);
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token');
    }


}