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


app.use('/projects', projectsRouter)
app.use('/collaboration', collabsRouter)


app.engine("hbs", expressHandlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname,'views/layouts'),
  })
)


app.use(function(request, response, next){
	response.locals.isLoggedIn = request.session.isLoggedIn
	next()
})


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
        isLoggedIn: true,
      }
  }
  const errors = []
  db.getAllProjects((err, Projects) => { 
    if (err) {
      errors.push("Internal error")
      console.log(err)
      return
    }
    else {
      model = {
          errors,
          Projects
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

  db.getAllCollab((err, Collabs) => { 
    if (err) {
      console.log(err)
      return
    }
    else {
      model = {
        Collabs,
        isLoggedIn: req.session.isLoggedIn
      }
      console.log(model)
      res.render('collaboration.hbs', model)
    }
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
