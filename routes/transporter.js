const nodemailer = require('nodemailer')
require('dotenv/config')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
    tls: {
        rejectUnauthorized:false
    }
})

transporter.verify((error, message) => {
    if (error) {
        console.log(error)
    } else {
        console.log(message)
    }
})
module.exports= {transporter}