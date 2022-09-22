const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3')
const multer = require("multer")
const upload = multer({dest: 'public/assets/'})
const db = new sqlite3.Database("portfolio-database.db")
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }))

db.run(`
  CREATE TABLE IF NOT EXISTS  projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    bgImage BLOB
  )
`)

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "public/assets/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

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
  
  res.render('createProject.hbs')
})

router.post('/views/createProject', (req, res) => { 
  var title = req.body.title
  var subtitle = req.body.subtitle
  var desc = req.body.description
  var bgImage = req.body.bgImage
  
  const query = `
    INSERT INTO projects (title, subtitle, desc, bgImage) VALUES (?, ?, ?, ?)
  `
  const values = [title, subtitle, desc, bgImage]

  db.run(query, values, function (err) { 
    res.redirect('projects.hbs')
  })
})

// function auth(req, res, next) {
//     if (req.query.admin === 'true') {
//         req.admin = true
//         next()
//     } else {
//         res.send(403)
//     }
// }

module.exports = uploadFile
module.exports = router