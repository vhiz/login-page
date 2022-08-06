const User = require('../models/User')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const nodemailer = require('nodemailer')
require('dotenv/config')


router.post('', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('user not found')
    
    try {
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        })

        var mailOptions = {
            from: '"Reset your password "<The Invisible>',
            to: user.email,
            subject: 'reset your password',
            html: `<h2>${user.email} Thank for using this platform</h2>
                <p>please verify your mail to continue</p>
                <a href = "http://${req.headers.host}/forgot/reset?token=${user.emailToken}">Verify</a>
            `
        }

        try {
            await transporter.sendMail(mailOptions, (error, message) => {
            if (error) {
               console.log(error)
            } else {
                console.log(message)
            }
        })
        } catch (error) {
            return res.status(400).send(error.message)
        }
        res.status(200).send('email sent')
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.get('/reset', async (req, res) => {
    let { token } = req.query
    
    try {
        const user = await User.findOne({ emailToken: token })
        if (user) {
            res.status(200).render('reset', {email: user.email})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/reset', async (req, res) => {
    let { token } = req.query
    try {
        const user = await User.findOne({ emailToken: token })
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(req.body.password, salt)
        }
        if (user) {
            user.password =password
            await user.save()
            res.send('passwoerd is changed')
        }
    } catch (error) {
        
    }
})


module.exports = router