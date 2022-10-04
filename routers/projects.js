const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
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
const upload = multer({storage: storage})


router.post('/createProject', upload.single('image'), (req, res) => { 
  const title = req.params.title
  const subtitle = req.params.subtitle
  const desc = req.params.description
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
        return
      
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

//view a project with a specific id
router.get('/projectByID/:id', (req, res) => {
  const id = req.body.id

  db.getProjectByID(id, function (err, projects) { 
    if (err) { 
      const errors = "Could not load project, please try again later"
      const model = {
        errors
      }
      res.render('projectByID.hbs', model)
      return
    } else {
      const model = {
        pageContent: projects
      }
      res.render('projectByID.hbs', model)
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