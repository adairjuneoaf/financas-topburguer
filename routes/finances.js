const express = require('express')
const routes = express.Router()

routes.get('/finances', (req, res) => {
    res.render('finances')
})

module.exports = routes