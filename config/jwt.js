// KEY TOKEN : boblightning
const jwt = require('jsonwebtoken');
const Crypto = require('crypto')

module.exports = {

    createToken: (payload) => {
        return jwt.sign(payload, process.env.TOKEN_KEY, {
            expiresIn: '12h'
        })
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, process.env.TOKEN_KEY, (err, decode) => {
            if (err) {
                res.status(401).send({
                    message: 'User not Authorization',
                    success: false,
                    error: err
                })
            }
            req.dataUser = decode
            next()
        })
    }

}