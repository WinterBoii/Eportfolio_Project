const dummyData = require('../dummy-data')
const express = require('express')
const router = express.Router()


router.get('/work', (req, res) => {
    res.render("work.hbs", model)
})

module.exports = router