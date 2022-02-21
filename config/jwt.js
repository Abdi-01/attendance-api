// KEY TOKEN : boblightning

const jwt = require ("jsonwebtoken");
const Crypto = require('crypto');

module.exports = {
    readToken: (req, res, next) => {
        jwt.verify(req.token, process.env.TOKEN_KEY, (err, decode) => {
            if (err) {
                res.status(401).send({
                    messages: 'user not authentication',
                    success: false,
                    error: err
                })
            }

            req.dataUser = decode

            next()
        })
    }
}