const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
    res.render('finances')
})

module.exports = routes