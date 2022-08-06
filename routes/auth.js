const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto') 
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const UserVerification = require('../models/UserVerificatiion')




router.post('/register', async (req, res) => {

    
    //if userexist 
    const emailexist = await User.findOne({ email: req.body.email })
    if(emailexist) return res.status(400).send('email used already')

    

    //hased password
     const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
         

  

    const newUser =await new User({
        email: req.body.email,
        password: password,
        emailToken:crypto.randomBytes(72).toString('hex')
    })

    const newVerification = new UserVerification({
            uniqueString: crypto.randomBytes(40).toString('hex'),
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600,
        })
    try {
        

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        })

        var mailOptions = {
            from: '"Verify your email "<The Invisible>',
            to: newUser.email,
            subject: 'please verify your email',
            html: `<h2>${newUser.email} Thank for using this platform</h2>
                <p>please verify your mail to continue</p>
                <a href = "http://${req.headers.host}/verify?token=${newUser.emailToken}&uniqueString=${newVerification.uniqueString}">Verify</a>
            `
        }


        
        try {
            await newVerification.save()
            transporter.sendMail(mailOptions, (error, message) => {
            if (error) {
               console.log(error)
            } else {
                console.log(message)
            }
        })
        } catch (error) {
            return res.status(400).send(error.message)
        }
        const savedUser = await newUser.save()
        res.status(200).send('go to email to verify')
    } catch (error) {
        res.status(400).send(error.message)        
    }
})


router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('email does not exist')

    if(!user.isVerified) return res.status(400).send('go to email and verify')
    
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) return res.status(400).send('password  not correct')
    
    const token = jwt.sign({ id: user.id }, process.env.TOKEN, { expiresIn: '24h' })
    res.status(200).send({token, user})
})


module.exports = router