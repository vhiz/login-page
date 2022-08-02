const User = require('../models/User')
const UserVerification = require('../models/UserVerificatiion')

const router = require('express').Router()

router.get('', async (req, res) => {
    let { uniqueString, token } = req.query
    try {
        const verification=await UserVerification.findOne({ uniqueString: uniqueString })
        if (verification) {
            const { expiresAt } = verification.expiresAt
            if (expiresAt < Date.now()) {
                const deleted = await UserVerification.deleteOne({ uniqueString: uniqueString })
                if (deleted) {
                    const user = await User.deleteOne({ emailToken: token })
                    res.send('You need to sign up cause link has expired')
                }
            } else {
                const user = await User.findOne({ emailToken: token })
                if (user) {
                    user.isVerified = true
                    await user.save()
                    await UserVerification.deleteOne({uniqueString: uniqueString})
                    return res.status(200).send('email is validated')
                }
            }
        }
    } catch (error) {
        return res.status(400).send(error)
    }
})


module.exports = router

