if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')


const initializePassport = require('./passport-config')
//UTILIZA FUNÇÃO APÓS FAZER UMA BUSCA(find()) NO BD OU NA VARIAVEL LOCAL
initializePassport(passport, email => {
    return users.find(user => user.email === email)
})

const users = []

const fileRouteIndex = require('./routes/index')
//const fileRouteRegister = require('./routes/register')
const fileRouteFinances = require('./routes/finances')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado ao banco de dados'))

app.use('/', fileRouteIndex)
//app.use('/', fileRouteRegister)
app.use('/', fileRouteFinances)

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
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

app.listen(process.env.PORT || 3000, () => {console.log('Server iniciado na porta 3000')})
