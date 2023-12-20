var JWT = require('jsonwebtoken');

exports.requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token " });
    }
}