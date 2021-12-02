const express = require('express')
const routes = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/users')

routes.get('/', async (req, res) => {
    const exists = await User.exists({ username: "admin" });

    if (exists) {
        res.redirect('/');
        console.log("Username já cadastrado!")
        return;
    };

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash("admin789", salt, function (err, hash) {
            if (err) return next(err);

            const newAdmin = new User({
                name: "SysAdmin",
                username: "admin",
                password: hash
            });

            newAdmin.save();
            console.log('Usuário criado.')

            res.redirect('/');
        });
    });
});

module.exports = routes