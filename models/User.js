const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    emailToken:{type:String},
    amount:{type:Number},
    isAdmin:{type:Boolean, default:false},
    payment:[{type:String}]
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User