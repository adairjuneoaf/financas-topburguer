if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()

const fileRouteIndex = require('./routes/index')
const fileRouteFinances = require('./routes/finances')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado ao banco de dados'))

app.use('/', fileRouteIndex)
app.use('/', fileRouteFinances)

app.listen(process.env.PORT || 3000, () => {console.log('Server iniciado na porta 3000')})
