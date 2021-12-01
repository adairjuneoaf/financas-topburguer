if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('connect-flash')
//const bodyParser = require('body-parser')

/*
const initializePassport = require('./passport-config')
//UTILIZA FUNÇÃO APÓS FAZER UMA BUSCA(find()) NO BD OU NA VARIAVEL LOCAL
initializePassport(passport, email => {
    return users.find(user => user.email === email)
})

const users = []
*/

//const fileRouteIndex = require('./routes/index')
const fileRouteRegister = require('./routes/register')
//const fileRouteFinances = require('./routes/finances')

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado ao banco de dados'))
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use(flash())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

//app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

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

function loggedOn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/')
}

function loggedOff(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/')
}

app.get('/', (req, res) => {
    const errors = req.flash().error || []
    res.render('index', { errors })
})

app.post('/', passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/finances',
    failureRedirect: '/',
}))

app.get('/finances', loggedOn, (req, res) => {
    res.render('finances')
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

/*app.get('/recovery', (req, res) => {
    res.send('Entre em contato com o adminsitrador do sistema para redinir sua senha.')
    res.setTimeout(5000, () => {
        res.redirect('/')
    })
})*/

app.get('/recovery', function (req, res) {
    const errors = req.flash().error || ['Entre em contato com o administrador do sistema para redefinir sua senha.']
    res.render('index', { errors })
});

app.get('/setup', async (req, res) => {
    const exists = await User.exists({ username: "adairjuneo" });

    if (exists) {
        res.redirect('/');
        console.log("Username já cadastrado!")
        return;
    };

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash("315221AJlf", salt, function (err, hash) {
            if (err) return next(err);

            const newAdmin = new User({
                username: "adairjuneo",
                password: hash
            });

            newAdmin.save();
            console.log('Usuário criado.')

            res.redirect('/');
        });
    });
});

//app.use('/', fileRouteIndex)
app.use('/register', loggedOn, fileRouteRegister)
//app.use('/finances', isLoggedIn, fileRouteFinances)

app.listen(process.env.PORT || 3000, () => { console.log('Servidor iniciado na porta 3000') })
