const path = require('path')
const router = require('express').Router()

//getting index.html to be served from express
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
})

//get animals.html
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'))
})

//get zookeepers.html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'))
})

//wildcard route to send users back to index.html - should ALWAYS be LAST
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
})

module.exports = router
