const dummyData = require('../dummy-data')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
  const model = {
        humans: dummyData.humans
    }
    res.render("home.hbs", model)
})

module.exports = router