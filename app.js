const express = require("express")
const expressHandlebars = require("express-handlebars")
const session = require("express-session")
const bodyParser = require('body-parser')
const SQLiteStore = require('connect-sqlite3')(session)
const path = require("path")
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const app = express()

const guestBookRouter = require("./routers/guestbook")
const projectRouter = require("./routers/project")
const collaborationRouter = require("./routers/collaboration")

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/public", express.static(path.join(__dirname, "/public")))

app.use(
	express.urlencoded({
		extended: false
	})
)

app.use(session({
  secret: "osjdioajsdioajshdioqjaqipowrh1moiiaiohsjdj",
  saveUninitialized: false,
  resave: false,
  store: new SQLiteStore({
    database: "sessions.db"
  })
}))

app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn
	next()
})

app.use('/projects', projectRouter)
app.use('/collaborations', collaborationRouter)
app.use('/guestBook', guestBookRouter)

app.engine("hbs", expressHandlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  partialsDir: __dirname + '/views/partials',
  layoutsDir: path.join(__dirname,'views/layouts'),
  })
)

// define the home page route
app.get('/', (req, res) => {
	const model = {
    session: req.session
	}
	res.render('start.hbs', model)
})

// define the contact page route
app.get('/contact', (req, res) => {
  const model = {
    hideFooter: true,
    isLoggedIn: req.session.isLoggedIn
  }
  res.render('contact.hbs', model)
})

// define the contact route
app.get('/contact', (req, res) => {
  res.render('contact.hbs')
})

app.get('/login', (req, res) => {
  model = {
    hideFooter: true
  }
  res.render('login.hbs', model)
  return
})

const ADMIN_USERNAME = "obmu20"
const hash = "$2y$10$/cir59GUKNOsqRkvmnn3UOINTr.g5e46Gxx5/RFq8mT9TIzxzV7pu"

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (username === ADMIN_USERNAME && bcrypt.compare(password, hash)) { 
    req.session.isLoggedIn = true
    res.redirect('/')
  } else {
    res.render('login.hbs', {
      hideFooter: true
    })
  }
})

app.get("/logout", (req, res) => {
  req.session.isLoggedIn = false
  res.redirect("/")
})

const port = 3000

app.listen(port)
