const express = require("express")
const expressHandlebars = require("express-handlebars")
const session = require("express-session")
const bodyParser = require('body-parser')
const SQLiteStore = require('connect-sqlite3')(session)
const path = require("path")
const app = express()
const db = require('./db') 

const projectsRouter = require("./routers/projects");
const collabsRouter = require("./routers/collabs");

app.use(session({
  secret: "osjdioajsdioajshdioqjaqipowrh1moiiaiohsjdj",
  saveUninitialized: false,
  resave: false,
  store: new SQLiteStore({
    database: "sessions.db"
  })
}))

app.set('views', path.join(__dirname, 'views'))

app.use("/public", express.static(path.join(__dirname, "/public")))

app.use('/', projectsRouter)
app.use('/', collabsRouter)


app.use(bodyParser.urlencoded({ extended: false }))



app.engine("hbs", expressHandlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname,'views/layouts'),
  })
)

app.engine(".hbs", expressHandlebars.engine({
    defaultLayout: "main.hbs",
    extname: "hbs"
}))

app.use(function(request, response, next){
	response.locals.isLoggedIn = request.session.isLoggedIn
	next()
})

app.use(
	express.urlencoded({
		extended: false
	})
)

// define the home page route
app.get('/', function(request, response){
	
	const model = {
		session: request.session
	}
	response.render('start.hbs', model)
})

// define the project route
app.get('/projects', (req, res) => {
  if (req.session.isLoggedIn) {
      const model = {
        isLoggedIn: session.isLoggedIn,
      }
  }
  const errors = []
  db.getAllProjects((err, projects) => { 
    if (err) {
      errors.push("Internal error")
      console.log(err)
      return
    }
    else {
      model = {
          errors,
          projects
        }
    }
    res.render('projects.hbs', model)
  })
})

// define the contact route
app.get('/contact', (req, res) => {
  res.render('contact.hbs')
})

// define the collaboration route
app.get('/collaboration', (req, res) => { 
  if (req.session.isLoggedIn) {
      const model = {
        isLoggedIn: session.isLoggedIn,
      }
    }
  db.getAllCollab((err, collabs) => { 
    if (err) {
      console.log(err)
      return
    }
    else {
      model = {
          collabs
        }
    }
    res.render('collaboration.hbs', model)
  })
})

app.get('/login', (req, res) => {
  model = {
    hideFooter: true
  }
  res.render('login.hbs', model)
  return
})

const ADMIN_USERNAME = "obmu20"
const ADMIN_PASSWORD = "obmu20xw"

app.post('/login', (req, res) => {

  const username = req.body.username
  const password = req.body.password

  if (username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
    req.session.isLoggedIn = true
    res.redirect('/')
  } else {
    error = "Wrong Username or Password"
    const model = {
      hideFooter: true,
      error
    }
    response.render('login.hbs', model)
    return
  }
})

app.get("/logout", function(request, response){
  request.session.isLoggedIn = false
  response.redirect("/")
})

const port = 3000

app.listen(port)
