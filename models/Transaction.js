
const mongoose = require('mongoose')

const depositSchema = new mongoose.Schema({
    amount: {type: Number , required: true},
    product:[{type:String}]
}, { timestamps: true })

const Deposit = mongoose.model('Deposit', depositSchema)

module.exports= { Deposit }