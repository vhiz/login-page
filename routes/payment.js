const { verifiedAuth } = require("./verify")
const {Deposit} = require('../models/Transaction')
const User = require("../models/User")
const { Product } = require("../models/Product")
const router = require('express').Router()
const nodemailer = require('nodemailer')
require('dotenv/config')


router.post('/:id/:productid', verifiedAuth, async (req, res) => {

    const product = await Product.findById(req.params.productid)
    if(!product) return res.status(400).send('product does not exist')
    const number = parseInt(product.amount)
    const newDeposit = await new Deposit({
        amount: number,

    })

    

    


    const user = await User.findById(req.params.id)

    const amount = parseInt(user.amount)


    if (user.amount >= product.amount) {

        const balance = amount - number
        user.amount = parseInt(balance)
        await user.save()
        const saveddeposit = await newDeposit.save()
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $push: { payment: saveddeposit._id }
            })
            await Deposit.findByIdAndUpdate(saveddeposit.id, {
                $push:{product:req.params.productid}
            })
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS
                },
                from: process.env.AUTH_EMAIL
            })

            var mailOptions = {
                from: '"Transaction "<delivery service>',
                to: user.email,
                subject: 'You made a transaction',
                html: `<h2>${user.email} Thank for using this platform</h2>
                <p>please verify that you made this transaction </p>
                <p><b>You made a payment of N${number} to buy ${product.title}
                and your balance is N${balance}</b></p>
            `
            }
            try {
                transporter.sendMail(mailOptions, (error, message) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(message)
                    }
                })
            } catch (error) {
                console.log(error)
            }
            await Product.findByIdAndDelete(req.params.productid)
        } catch (error) {
            console.log(error)
        }
        res.status(200).send(`you current have N${balance} in your account`)
    } else {
        return res.status(400).send('insuficent balance')
    }






})



module.exports = router