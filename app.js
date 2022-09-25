const express = require("express");
const expressHandlebars = require("express-handlebars");
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const path = require("path");
const app = express();

const eport = require("./routers/eport");

app.use(expressSession({
    secret:"winter123",
    saveUninitialized:false,
    resave: false,
    store: new SQLiteStore({
      database: "sessions.db"
    })
}))

app.engine("hbs", expressHandlebars.engine({
		extname: "hbs",
		defaultLayout: "main",
	})
);

app.get('/login', (req, res) => {
  if(req.session.isLoggedIn){
    res.redirect('/')
    return
  }
  model={
    hideFooter: true
  }
  res.render('login.hbs', model)
  return
}) 

const ADMIN_USERNAME = "obmu20"

app.use("/public", express.static(path.join(__dirname, "/public")));


app.use(eport);

app.listen(3000);
