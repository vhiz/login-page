const mongoose = require('mongoose')

const userVerificationSchema = new mongoose.Schema({
    uniqueString: { type: String },
    createdAt: {type: Date},
    expiresAt:{type:Date}
})

const UserVerification = mongoose.model('UserVerification', userVerificationSchema)
module.exports = UserVerification