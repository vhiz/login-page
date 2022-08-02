const User = require('../models/User')

const router = require('express').Router()

router.get('', async (req, res) => {
    try {
        const token = req.query.token
        const user = await User.findOne({ emailToken: token })
        if (user) {
            user.isVerified = true
            await user.save()
            return res.status(200).send('email is validated')
        }
    } catch (error) {
        return res.status(400).send('not verified')
    }
})


module.exports= router