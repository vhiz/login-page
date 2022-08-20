const { Product } = require('../models/Product')
const { route } = require('./verified')
const { verifiedAdmin } = require('./verify')

const router= require('express').Router()


router.post('/create', verifiedAdmin,async(req,res)=>{
    const newproduct = await new Product(req.body)
    try{
    const savedproduct = await newproduct.save()
    res.status(200).send(savedproduct)
    }catch(error){
        res.status(400).send(error)
    }

    
})

router.delete('/delete/:id', verifiedAdmin, async(req, res)=>{
    try {
        const deleteproduct = await Product.findByIdAndDelete(req.params.id)
        if(!deleteproduct) return res.status(400).send('no such product')

        res.status(200).send(deleteproduct)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/allproduct', async(req, res)=>{
    const all = await Product.find()

    res.status(200).send(all)
})

module.exports = router