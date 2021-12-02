const express = require('express')
const routes = express.Router()
const localStrategy = require('passport-local').Strategy
const passport = require('passport')
const bcrypt = require('bcrypt')

const User = require('../models/users')

routes.use(passport.initialize())
routes.use(passport.session())

routes.get('/', (req, res) => {
    const errors = req.flash().error || []
    res.render('index', { errors })
})

routes.post('/', passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/finances',
    failureRedirect: '/',
}))

routes.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

passport.use(new localStrategy({
    passReqToCallback: true,
}, function (req, username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) return done(err)
        if (!user) return done(null, false, req.flash('error', 'Não encontrei esse nome de usuário cadastrado.'))

        bcrypt.compare(password, user.password, function (err, res) {
            if (err) return done(err)
            if (res === false) return done(null, false, req.flash('error', 'Opps, senha incorreta!'))

            return done(null, user)
        })
    })
}))

routes.get('/recovery', function (req, res) {
    const errors = req.flash().error || ['Entre em contato com o administrador do sistema para redefinir sua senha.']
    res.render('index', { errors })
});

module.exports = routes