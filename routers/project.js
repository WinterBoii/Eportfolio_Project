const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('../db')
const validators = require('../validators')

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

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
      cb(null, true)
    } else {
      req.isUploadError = true
      cb(null, false)
    }
  }
})

// define the projects route
router.get('/', (req, res) => { 
  const errors = []
  db.getAllProjects((err, projects) => { 
    if (err) {
      return res.status(500).send(err)
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

//define the create project route
router.get('/create', (req, res) => { 
  if (req.session.isLoggedIn) {
    res.render('createProject.hbs') 
    return
  } else {
    res.redirect('/login')
    return
  }
})

router.post('/create', upload.single('backgroundImage'), (req, res) => { 
  const projectData = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    backgroundImage: req.filePath
  }

  const errors = validators.getValidationErrorsForProject(projectData)

  if (!req.session.isLoggedIn) {
    return res.status(401).send("Unauthorized")
  }

  if (req.isUploadError) {
    errors.push("Please upload an image")
  }
  if (errors.length > 0) {
    const model = { errors }
    res.render('createProject.hbs', model) 
  } else {
    db.createProject(projectData.title, projectData.subtitle, projectData.description, projectData.backgroundImage, function (err) {
      if (err) {
        return res.status(500).send(err).redirect('/create')
      } else {
        res.redirect('/projects')
      }
    })
  }
})

//view a project with a specific id
router.get('/:id', (req, res) => {
  const id = req.params.id

  db.getProjectByID(id, function (err, project) { 
    if (err) {
      return res.status(500).send(err)
    }
    else {
      const model = { project }
      res.render('project.hbs', model)
      return
    }
  })
})

// define the update route
router.get('/:id/update', (req, res) => { 
  const id = req.params.id

  if (!req.session.isLoggedIn) {
		return res.status(401).send("Unauthorized")
	} 
	
	db.getProjectByID(id, function(err, project){
    if (err) { 
      res.status(500).send(err)
    } else {
      const model = { project }
      res.render('updateProject.hbs', model)	
    }
	})	
})

router.post('/:id/update', upload.single('backgroundImage'), (req, res) => {
  const projectData = {
    id : req.params.id,
    title : req.body.title,
    subtitle : req.body.subtitle,
    description : req.body.description,
    backgroundImage : req.filePath,
  }
	
  const errors = validators.getValidationErrorsForProject(projectData)
	
  if (req.isUploadError) {
    errors.push("Please upload an image")
  }
  if (errors.length > 0) {
    const model = {
      errors
    }
    res.render('updateProject.hbs', model) 
    return
  }

  if (!req.session.isLoggedIn) {
    return res.status(401).send("Unauthorized")
  }
  
  if (errors.length == 0) {
		
    db.updateProjectById(projectData.id, projectData.title, projectData.subtitle, projectData.description, projectData.backgroundImage, function (err) {
      if (err) {
        return res.status(500).send(err)
        } else {
          res.redirect('/projects/' + projectData.id)
        }
    })
  } else {
      const model = { errors } 
      res.render('updateProject.hbs', model)
  }
})

//delet a post with a specific id
router.post('/:id/delete', function (req, res) {
  const id = req.params.id

  if(!req.session.isLoggedIn){
    return res.status(401).send("Unauthorized")
  }
  
  db.deleteProjectById(id, function (err) {
    if (err) {
      return res.status(500).send(err)
    } else {
      res.redirect('/projects')
    }
  })
})

module.exports = router