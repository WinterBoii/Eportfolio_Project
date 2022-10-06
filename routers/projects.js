const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))

const multer = require('multer')
const { request } = require('http')
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
router.get('/createProject', (req, res) => { 
  if (req.session.isLoggedIn) {
    res.render('createProject.hbs') 
    return
  } else {
    res.render('/login.hbs')
    return
  }
})


router.post('/createProject', upload.single('image'), (req, res) => { 
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

// //delet a post with a specific id
// router.post('/projectByID/:id', function (req, res) {
//   const id = req.params.id

//   if(!request.session.isLoggedIn){
//       const errors="You need to be logged in to update the project."
//       model={
//         errors
//       }
//       response.render("Home.hbs", model)
//       return
//   }
  
//   db.getProjectByID(id, function (err) {
//     if (err) {
//       const errors = "Could not get project, please try again later"
//       const model = {
//         errors
//       }
//       res.render('start.hbs', model)
//       return
//     } else {
//       const success = "The delete was successful"
//       model = {
//         success
//       }
//       res.render('projects.hbs', model)
//     }
//   })
// })

router.get('/project', (req, res) => { 
  res.render('project.hbs', model)
})

//view a project with a specific id
router.get('/projects/:id', (req, res) => {
  const id = req.params.id
  console.log(id)

  const errorMessage = []

  db.getProjectByID(id, function (err, project) { 
    if (err) {
      errorMessage.push("Query error")
      const model = {
        errorMessage: errorMessage,
        project: project
      }
      res.render('/project.hbs', model)
      return
    }
    else {
      const model = {
        errorMessage: errorMessage,
        project: project
      }
      res.render('project.hbs', model)
      return
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