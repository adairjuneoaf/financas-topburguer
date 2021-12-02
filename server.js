//LOGICA PARA VARIAVEL GLOBAL RECEBER URL E CONECTAR AO BANCO DE DADOS(LOCAL QUANDO EM DEV. E NUVEM QUANDO PROD.)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//CONSTANTES INICIALIZANDO AS FERRAMENTAS PARA UTILIZAR
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

//CONSTANTES IMPORTANTO AS ROTAS
const fileRouteIndex = require('./routes/index')
const fileRouteRegister = require('./routes/register')
//const fileRouteSetup = require('./routes/setup')
const fileRouteFinances = require('./routes/finances')

//LÓGICA DE CONEXÃO COM O BANCO DE DADOS
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado ao banco de dados'))
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//INFORMANDO AO NOSSO PROJETO QUAL O MOTOR DE RENDERIZAÇÃO E PASTA DE VIEWS
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

//INFORMANDO AO EXPRESS QUAL A NOSSA PASTA PÚBLICA DE ARQUIVOS
app.use(express.static('public'))

//HABILITANDO USO DE RECURSO PARA MENSAGENS FLASH EM TELA
app.use(flash())

app.use(methodOverride('_method'))

//CRIANDO UMA SESSÃO PARA MANTER USUÁRIO LOGADO
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

//UTILIZANDO O EXPRESS PARA SOLICITAÇÕES POST NO ENVIO DE DADOS
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//FUNÇÃO PARA VERIFICAR SE USUÁRIO ESTÁ LOGADO PARA ACESSAR OS ROTAS
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

//USANDO AS ROTAS JÁ IMPORTADAS E SETANDO UM PARAMETRO PARA VERIFICAR O USUÁRIO LOGADO
app.use('/', fileRouteIndex)
app.use('/register', loggedOn, fileRouteRegister)
//app.use('/setup', fileRouteSetup)
app.use('/finances', loggedOn, fileRouteFinances)

app.listen(process.env.PORT || 3000, () => { console.log('Servidor iniciado na porta 3000') })
