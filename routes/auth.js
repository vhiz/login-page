const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto') 
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')




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
                <a href = "http://${req.headers.host}/verify?token=${newUser.emailToken}">Verify</a>
            `
        }


        transporter.sendMail(mailOptions, (error, message) => {
            if (error) {
               console.log(error)
            } else {
                console.log(message)
            }
        })
        const savedUser = await newUser.save()
        res.status(200).send('go to email to verify')
    } catch (error) {
        res.status(400).send(error.message)        
    }
})


router.post('/login', async (req, res) => {
     const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send("email doest not exist ☹️")

    if (!user.isVerified) return res.status(401).send("go to email and verify")

    const valid = bcrypt.compare(req.body.password, userExist.password)
    if(!valid) return res.status(401).send('password not correct ')

    
    
    const token = jwt.sign({ id: user._id }, process.env.TOKEN, { expiresIn: '24h' })
    res.status(200).send("You are logedin🌄", { token})

    
})



module.exports = router