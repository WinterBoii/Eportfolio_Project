const projecstData = require('../projectsData')
const express = require('express')


const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
  res.render('start.hbs')
})
// define the project route
router.get('/projects', (req, res) => {
  const module = {
    projects: projecstData.projects
  }
  res.render('projects.hbs', module)
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