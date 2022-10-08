const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, 'public/Images/')
  },
  filename: (req, file, cb) => { 
    console.log(file)
    const fileName = Date.now() + path.extname(file.originalname)
    req.filePath = fileName
    cb(null, fileName)
  }
})
const upload = multer({ storage: storage })

//define the create project route
router.get('/create', (req, res) => { 
  if (req.session.isLoggedIn) {
    res.render('createProject.hbs') 
    return
  } else {
    res.render('/login.hbs')
    return
  }
})


router.post('/projects/create', upload.single('image'), (req, res) => { 
  const title = req.body.title
  const subtitle = req.body.subtitle
  const desc = req.body.description
  const bgImage = req.filePath
  console.log(title, subtitle, desc, bgImage)

  if (!req.session.isLoggedIn) {
    return res.status(401).send('Unauthorized')
  } else {
    db.createProject(title, subtitle, desc, bgImage, function (err) {
      if (err) {
        const errors = "Could not upload to the server, please try again later"
        const model = {
          errors
        }
        res.render('start.hbs', model)
      
      } else {
        res.redirect('/projects')
      }
    })
  }
})

router.get('/project', (req, res) => { 
  const model = {
    Project,
    isLoggedIn: req.session.isLoggedIn
  }
  res.render('project.hbs', model)
})

//view a project with a specific id
router.get('/:id', (req, res) => {
  const id = req.params.id

  const errorMessage = []
  const model = {}

  db.getProjectByID(id, function (err, project) { 
    if (err) {
      errorMessage.push("Query error")
      model.errorMessage = err.message
      model.project = project

      res.render('/project.hbs', model)
      return
    }
    else {
      model.project = project
      model.isLoggedIn = req.session.isLoggedIn

      res.render('project.hbs', model)
      return
    }
  })
})

//delet a post with a specific id
router.post('/:id/delete', function (req, res) {
  const id = req.params.id

  if(!req.session.isLoggedIn){
      const errors = "You need to be logged in to update the project."
      model = {
        errors
      }
      response.render("login.hbs", model)
      return
  }
  
  db.deleteProjectById(id, function (err) {
    if (err) {
      const errors = "Could not get project, please try again later"
      const model = {
        errors
      }
      res.render('start.hbs', model)
      return
    } else {
        const success = "The delete was successful"
        model = {
          success
        }
      res.render('/', model)
    }
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

module.exports = router