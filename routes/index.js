const express = require('express')
const routes = express.Router()
const passport = require('passport')


routes.get('/', (req, res) => {
    res.render('index')
})

routes.post('/', passport.authenticate('local', {
    successRedirect: '/finances',
    failureRedirect: '/',
    failureFlash: true
}))

module.exports = routes