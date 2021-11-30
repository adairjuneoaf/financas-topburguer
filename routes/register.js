const express = require('express')
const routes = express.Router()
//const bcrypt = require('bcrypt')


//const users = []

routes.get('/', (req, res) => {
    res.render('register')
})

/*
routes.post('/register', async (req, res) => {
    try {
        const passwordEncoded = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: passwordEncoded
        })
        res.redirect('/')
    }catch {
        res.redirect('/register')
    }
    console.log(users)
})
*/

module.exports = routes