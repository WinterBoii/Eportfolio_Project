const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('../db')
const validators = require('../validators')

router.use(bodyParser.urlencoded({ extended: true }))

// define the collaboration route
router.get('/', (req, res) => { 
	const errors = []
  db.getAllCollaborations((err, collaboration) => { 
    if (err) {
      errors.push("Internal error")
      console.log(err)
      return
    }
    else {
      model = {
        errors,
        collaboration: collaboration
      }
			res.render('collaborations.hbs', model)
    }
  })
})

router.get("/create", (req, res) => {
	if (req.session.isLoggedIn) {
    res.render('createCollaboration.hbs') 
  } else {
    res.status(401).redirect('/login') // unauthorized
  }
})

router.post("/create", (req, res) => {

	const collaborationData = {
		profileImageLink : req.body.profileImageLink,
		fullName : req.body.name,
		position : req.body.position,
		paragraph : req.body.paragraph,
		twitter : req.body.twitterLink,
		facebook : req.body.facebookLink
	}

	const errors = validators.getValidationErrorsForCollabs(collaborationData)

	if (!collaborationData.profileImageLink) {
		collaborationData.profileImageLink = "/public/Images/pfp-placeholder.png"
	}

	if (errors.length > 0) {
		const model = {
      errors
		}
		res.render('updateCollaboration.hbs', model)
		return
	}

	if (!req.session.isLoggedIn) {
    res.status(401).redirect('/login')
	}
	
	if (errors.length == 0) {
		db.createCollaboration(
			collaborationData.profileImageLink,
			collaborationData.fullName,
			collaborationData.position,
			collaborationData.paragraph,
			collaborationData.twitter,
			collaborationData.facebook,
			function (err)
			{
				if (err) {
					errors.push = "Could not upload to the server, please try again later"
					const model = {
						errors
					}
					res.render("createCollaboration.hbs", model)
					return
				} else {
					res.redirect('/collaborations')
				}
			}
		)
	} else {
		res.render('updateCollaboration.hbs', errors)
	} 
})

// define the update route
router.get('/:id', (req, res) => { 
	const id = req.params.id

	const errorMessage = []

	db.getCollaborationByID(id, function (err, collaboration) { 
		if (err) {
			errorMessage.push("Query error")
			const model = {
				errors,
				collaboration,
			}
			res.render('/collaboration.hbs', model)
		} else {
			const model = {
				collaboration,
			}
			res.render('collaboration.hbs', model)
		}
	})
})

router.get('/:id/update', (req, res) => { 
	const id = req.params.id

	if (!req.session.isLoggedIn) {
		res.status(401).redirect('/login')
	}

	db.getCollaborationByID(id, function (err, collaboration) { 
		if (err) {
			res.status(500).send(err)
		} else {
			const model = {
				collaboration,
			}
			res.render('updateCollaboration.hbs', model)
		}
	})
})

router.post('/:id/update', (req, res) => { 
	const collaborationData = {
		id: req.params.id,
		profileImageLink : req.body.profileImageLink,
		fullName : req.body.name,
		position : req.body.position,
		paragraph : req.body.paragraph,
		twitter : req.body.twitterLink,
		facebook : req.body.facebookLink
	}

	const errors = validators.getValidationErrorsForCollabs(collaborationData)

	if (!collaborationData.profileImageLink) {
		collaborationData.profileImageLink = "/public/Images/pfp-placeholder.png"
	}

	if (!req.session.isLoggedIn) {
    res.status(401).redirect('/login')
	}
	
	if (errors.length == 0) {
		
		db.updateCollaborationById(
			collaborationData.id,
			collaborationData.profileImageLink,
			collaborationData.fullName,
			collaborationData.position,
			collaborationData.paragraph,
			collaborationData.twitter,
			collaborationData.facebook,
			function (err)
			{ 
				if (err) {
					const errors = "Could not get project, please try again later"
					const model = {
						errors,
					}
					res.render('updateCollaboration.hbs', model)
					return
				} else {
					res.redirect('/collaborations')
				}
			})
	} else {
			const model = {
				errors
			}
		res.render('updateCollaboration.hbs', model)
	} 
})

router.post('/:id/delete', (req, res) => { 
	const id = req.params.id
	const errors = []
	const model = {}

	if (!req.session.isLoggedIn) { 
		errors.push = "You need to be logged in to perform the action!"
		model.push = { errors, hideFooter: true }
		res.render("login.hbs", model)
		return
	}	
	db.deleteCollaborationById(id, function (err) { 
		if (err) { 
			errors.push = "Could not delete from the database, please try again later"
			const model = { errors }
			res.render('collaborations.hbs', model)
			return
		} else {
			res.redirect('/collaborations')
		}
	})
})

module.exports = router
