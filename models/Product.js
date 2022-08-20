const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {type:String, required: true},
    description:{type:String, required:true},
    amount:{type:Number, required:true}
},{timestamps:true})

const Product = mongoose.model('Product', productSchema)

module.exports={Product}