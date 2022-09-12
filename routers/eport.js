const projecstData = require('../projectsData')
const express = require('express')

const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
  res.render('start.hbs')
})
// define the project route
router.get('/projects', (req, res) => {
  res.render('projects.hbs')
})

module.exports = router