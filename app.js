const express = require('express')
const app = express()
const helmet = require('helmet')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const verifyRoutes = require('./routes/verified')
const forgotRoutes = require('./routes/forgort')
require('dotenv/config')

mongoose.connect(process.env.CLONE,()=>{
    console.log('database connected🆗')
})

app.use(helmet())

app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", "trusted-cdn.com"] }} ))
app.use(express.json())



app.get('', (req, res) => {
    res.send('Simple log in  🌊')
})

app.use('/auth', authRoutes)
app.use('/verify', verifyRoutes)
app.use('/forgot', forgotRoutes)

var Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`😄 ${Port} 🚀`)
})