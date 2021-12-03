const express = require('express')
const routes = express.Router()

const User = require('../models/users')

routes.get('/', async (req, res) => {
    let searchTransaction = {}
    if (req.query.username != null && req.query.username !== '') {
        searchTransaction.username = new RegExp(req.query.username, 'i')
    }
    try{
        const usuarios = await User.find(searchTransaction)
        res.render('finances', {
            usuarios: usuarios,
            searchTransaction: req.query,
            name: req.user.name
        })
    } catch{
        res.redirect('/')
    }
})

routes.get('/transaction', async (req, res) => {
    res.render('transaction', {name: req.user.name})

})

module.exports = routes