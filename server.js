const express = require('express')
const app = express()

const fileRouteIndex = require('./routes/index')
const fileRouteFinances = require('./routes/finances')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))

app.use('/', fileRouteIndex)
app.use('/', fileRouteFinances)

app.listen('3000' , () => {console.log('Server iniciado na porta 3000')})
