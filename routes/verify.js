const jwt = require('jsonwebtoken')
require('dotenv/config')

const verified = (req, res, next) => {
    const authHeaders = req.headers.token
    if (authHeaders) {
        const token = authHeaders
        jwt.verify(token, process.env.TOKEN, (err, verified) => {
            if (err) return res.status(401).send('token is not correct')
            req.user = verified
            next()
        })
    } else {
        return res.status(401).send('you do not have acess to this site')
    }
}

const verifiedAuth = (req, res, next) => {
    verified(req, res, () => {
        if (req.user.id == req.params.id) {
            next()
        } else {
            return res.status(401).send('unauthorized')
        }
    })
}

module.exports= {verifiedAuth}