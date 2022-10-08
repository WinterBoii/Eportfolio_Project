const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: false }))


router.get("/create", (req, res) => {
	if (req.session.isLoggedIn) {
		const model = {
      isLoggedIn: true
    }
    res.render('createCollab.hbs', model) 
    return
  } else {
    res.redirect('/login.hbs')
    return
  }
})

router.post("/create", (req, res) => {
	var pfp = req.body.pfp
	const fullName = req.body.name
	const pos = req.body.position
	const para = req.body.paragraph
	const social1 = req.body.socialmedia1
	const social2 = req.body.socialmedia2

	const errors = []

	if (!req.session.isLoggedIn) {
		return res.status(401).send("Unauthorized");
	} else {
		
		db.createCollab(pfp, fullName, pos, para, social1, social2, function (err) {
				if (err) {
					errors.push = "Could not upload to the server, please try again later"
					const model = {
						errors
					}
					res.render("createCollab.hbs", model)
					return
				} else {
					res.render('collaboration.hbs')
				}
			}
		)
	}
})

module.exports = router
