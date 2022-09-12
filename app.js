
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')

const app = express()

const projectRouter = require('./routers/project-router')

app.engine("hbs", expressHandlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}))

app.get('/', (req, res) => { 
    res.render('home.hbs')
})

app.get('/', (req, res) => { 
    res.render('work.hbs')
})

app.use('/public', express.static(path.join(__dirname,'/public')))

app.use(projectRouter)

app.listen(8080)