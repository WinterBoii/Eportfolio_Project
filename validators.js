const {body} = require('express-validator')
const MIN_LENGTH = 3
const MIN_SUB_LENGTH = 2
const MIN_DESCRIPTION_LENGTH = 5

const NAME_MIN_LENGTH = 1
const Subject_MIN_LENGTH = 5
const Feedback_MIN_LENGTH = 10

exports.getValidationErrorsForProject = function (projectData) {
	
	const validationErrors = []
	
  if (projectData.title.length < MIN_LENGTH){
		validationErrors.push("The name needs to be at least " + MIN_LENGTH + " characters.")
  }

  if (projectData.subtitle.length < MIN_SUB_LENGTH){
		validationErrors.push("The name needs to be at least " + MIN_SUB_LENGTH + " characters.")
	}
	
	if (projectData.description.length < MIN_DESCRIPTION_LENGTH){
		validationErrors.push("The description needs to be at least " + MIN_DESCRIPTION_LENGTH + " characters.")
  }
  if (!projectData.backgroundImage) { 
    validationErrors.push("The background image is missing.")
  }
	return validationErrors
}

exports.getValidationErrorsForCollabs = function (collaboration) {

	const validationErrors = []

	if (collaboration.name < MIN_LENGTH) {
			validationErrors.push = "Name must be at least " + MIN_LENGTH + " characters."
		}
		if (collaboration.position < MIN_SUB_LENGTH) {
			validationErrors.push = "Position must be at least " + MIN_SUB_LENGTH + " characters."
		}
		if (collaboration.paragraph < MIN_DESCRIPTION_LENGTH) {
			validationErrors.push = "Paragraph must be at least " + MIN_DESCRIPTION_LENGTH + " characters."
		}
		if (collaboration.twitterLink) {
			validationErrors.push = "No social link given"
		}
		if (collaboration.facebookLink) {
			validationErrors.push = "No social link given"
	}
	return validationErrors
}

exports.getValidationErrorsForFeedback = function (feedback){
	
	const validationErrors = []
	
	if (!isNaN(feedback.postname)){
		validationErrors.push("Name can't be a number" )
  }
  if (feedback.postname.length < NAME_MIN_LENGTH){
		validationErrors.push("The name must at least be " + NAME_MIN_LENGTH + " characters")
  }
  
  if (feedback.subject.length < Subject_MIN_LENGTH ){
    validationErrors.push("The subject must at least  be " + Subject_MIN_LENGTH + " characters")
  }

  if (!isNaN(feedback.subject)){
    validationErrors.push("Subject can't be a number")
  }

  if (feedback.feedbackContent.length < Feedback_MIN_LENGTH){
    validationErrors.push("The Content must at least be " + Feedback_MIN_LENGTH + " characters")
  }
  if (!isNaN(feedback.feedbackContent)){
    validationErrors.push("Content can't be a number'")
	}
	return validationErrors
}