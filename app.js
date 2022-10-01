const express = require("express")
const expressHandlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const path = require("path")
const app = express()
const db = require('./db') 

const projectsRouter = require("./routers/projects");

app.use(expressSession({
  secret: "osjdioajsdioajshdioqjaqipowrh1moiiaiohsjdj",
  saveUninitialized: false,
  resave: false,
  store: new SQLiteStore({
    database: "sessions.db"
  })
}))


app.use('/', projectsRouter)

app.engine("hbs", expressHandlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  })
);

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

  db.getAllProjects((err, projects) => { 
    const model = {
      projects: projects
    }
    res.render('projects.hbs', model)
  })
})

//define the create project route
app.get('/createProject', (req, res) => { 
  if (req.session.isLoggedIn) {
    res.render('createProject.hbs')
    return
  } else {
    res.redirect('/login.hbs')
    return
  }
})



// define the contact route
app.get('/contact', (req, res) => {
  res.render('contact.hbs')
})

app.get('/login', (req, res) => {
  //hideFooter = true

  if (req.session.isLoggedIn) {
    res.redirect('/')
    return
  }
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

app.use("/public", express.static(path.join(__dirname, "/public")))


app.use(projectsRouter);

const port = 3000

app.listen(port)
