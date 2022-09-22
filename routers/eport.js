const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3')
var bodyparser = require('body-parser')
const multer = require("multer")

const db = new sqlite3.Database("portfolio-database.db")

db.run(`
  CREATE TABLE IF NOT EXISTS  projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    bgImage BLOB
  )
`)

router.use(bodyparser.urlencoded({
    extended: true
}))

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/assets/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

//route for post data
router.post("/post", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:3000/createProject' + req.file.filename
        var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })
    }
})

// define the home page route
router.get('/', (req, res) => {
  res.render('start.hbs')
})
// define the project route
router.get('/projects', (req, res) => {

  const query = `SELECT * FROM projects`

  db.all(query, function (err, projects) {
    const module = {
    projects
    } 
    res.render('projects.hbs', module)
  })
})

// define the contact route
router.get('/contact', (req, res) => {
  const module = {
    contacts: projecstData.contacts
  }
  res.render('contact.hbs', module)
})

//define the create project route
router.get('/createProject', (req, res) => { 
  
  res.render('createProject.hbs', module)
})

router.post('/views/createProject', (req, res) => { 
  var title = req.body.title
  var subtitle = req.body.subtitle
  var desc = req.body.description
  var bgImage = req.body.bgImage
  

  // db.all({
  //   title: title,
  //   subtitle: subtitle,
  //   description: desc,
  //   bgImage: bgImage
  // })

  res.redirect('/projects')
})

// function auth(req, res, next) {
//     if (req.query.admin === 'true') {
//         req.admin = true
//         next()
//     } else {
//         res.send(403)
//     }
// }

module.exports = router