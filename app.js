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
app.use(express.json())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('main', {variants: ['Роскосмос', 'Пентагон', 'SpaceX', 'Nasa', 'Microsoft', 'Яндекс']})
})


app.post('/evl', 
    (req, res, next) => {
        const symbols = '1234567890/*-+()'
        for(let i = 0; i < req.body.exp.length; i++) {
            if(!symbols.includes(req.body.exp[i])) {
                req.body.exp = req.body.exp.slice(0, i) + req.body.exp.slice(i+1)
                i--
            }
        }
        next()
    },
(req, res) => {
    let num = (req.body.exp)
    let i = 0
    while(i < num.length) {
        if('+-*/()'.includes(num[i])) {
            i++
            continue
        }
        let oneNum = ''
        let j = i
        while(isFinite(num[j]) && j < num.length) {
            oneNum += num[j]
            j++
        }
        num = num.slice(0, j) + 'n' + num.slice(j)
        i = j+2
    }
    let result = num ? eval(num).toString() : '0'
    res.json({result: result, exp: req.body.exp})
})

app.listen(PORT)
