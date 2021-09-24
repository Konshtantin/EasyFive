const express = require('express')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const favicon = require('serve-favicon')

const app = express()

app.use(favicon(path.join(__dirname, 'public/favicon.ico')))

require('dotenv').config()
const PORT = process.env.PORT || 3000
app.use(compression())
app.use(helmet())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('main', {variants: ['Роскосмос', 'Пентагон', 'SpaceX', 'Nasa', 'Microsoft', 'Яндекс']})
})

app.listen(PORT)
