const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()
const { animals } = require('./:data/animals.json')
const fs = require('fs')
const path = require('path')
const apiRoutes = require('./routes/apiRoutes')
const htmlRoutes = require('./routes/htmlRoutes')

//makes the public files accesible - middleware
app.use(express.static('public'))
//parse incoming string or array data
app.use(express.urlencoded({ extended: true }))
//parse incoming JSON data
app.use(express.json())
app.use('/api', apiRoutes)
app.use('/', htmlRoutes)

//stays at the end
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})