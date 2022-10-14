const express = require('express')
const db = require('../db')
const validators = require('../validators')
const router = express.Router()

router.get("/", (req, res) => {

  db.getAllFeedback((error, feedback) => {
    if (error) {
      const errors = "Could not get guestBook page "
      const model = {
        errors,
      }
      res.render('guestBook.hbs', model)
    } else {
      const model = {
        feedback,
      }
      res.render('guestBook.hbs', model)
    }
  })
})

router.post("/", (req, res) => {

  const feedback = {
    postname: req.body.postname,
    subject: req.body.subject,
    feedbackContent: req.body.feedbackContent,
  }

  const errors = validators.getValidationErrorsForFeedback(feedback)

  if (0 < errors.length) {
    db.getAllFeedback((error, feedback) => {
      if (error) {
        const errors = "Could not get guestBook page"
        const model = {
          errors,
        }
        res.render('guestBook.hbs', model)

      } else {
        const model = {
          errors,
          feedback: feedback,
          postname,
          subject,
          feedbackContent
        }
        res.render('guestBook.hbs', model)
      }
    })
    return
  }

  //upload new feedback
  db.createFeedback(feedback.postname, feedback.subject, feedback.feedbackContent, (err) => {
    if (err) {
      const errors = "Could not upload to the server, please try again later"
      const model = {
        errors
      }
      res.render('guestBook.hbs', model)
      return

    } else {
      res.redirect('/guestBook')
    }
  })
})

// define the update route
router.get("/:id/update", (req, res) => {
  const id = req.params.id

  db.getUpdateFeedbackById(id, (error, feedback) => {
    if (error) {
      const errors = "Could not display the pagecontent, please try again later "
      const model = {
        errors,
      }
      res.render("updateFeedback.hbs", model)
      return
    } else if (!feedback) {
      const errors = "The post does not exist"
      const model = {
        errors,
      }
      res.render("updateFeedback.hbs", model)
      return

    } else {
      model = {
        feedback: feedback,
      }
      res.render("updateFeedback.hbs", model)
    }
  })
})

router.post("/:id/update", (req, res) => {

  const feedback = {
    id: req.params.id,
    postname: req.body.postname,
    subject: req.body.subject,
    feedbackContent: req.body.feedbackContent,
  }

  const errors = validators.getValidationErrorsForFeedback(feedback)

  if (!req.session.isLoggedIn) {
    const errors = "You need to be logged in to update the content"
    model = {
      errors
    }
    res.render("updateFeedback.hbs", model)
    return
  }

  if (0 < errors.length) {
    const model = {
      errors,
      feedback: {
        postname: feedback.postname,
        subject: feedback.subject,
        feedbackContent: feedback.feedbackContent,
      }
    }
    res.render("updateFeedback.hbs", model)
    return
  }

  db.updateFeedbackById(feedback.postname, feedback.subject, feedback.feedbackContent, feedback.id, (error) => {
    if (error) {
      const errors = "Could not upload to the server, please try again later "
      const model = {
        errors,
      }
      res.render('updateFeedback.hbs', model)
      return
    }
    else {
      res.redirect('/guestBook')
    }
  })
})

router.post("/:id/delete", (req, res) => {
  const id = req.params.id

  if (!req.session.isLoggedIn) {
    const errors = "You need to be logged in to delete the content"
    model = {
      errors
    }
    res.render("guestBook.hbs", model)
    return
  }

  db.deleteFeedbackById(id, (error) => {

    if (error) {
      const errors = "Could not delete this post, please try again later."
      const model = {
        errors
      }
      console.error(errors)
      res.render('guestBook.hbs', model)
      return
    } else {
      res.redirect("/guestBook")
    }
  })
})

module.exports = router