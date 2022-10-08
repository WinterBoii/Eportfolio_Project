const MIN_TITLE_LENGTH = 3
const MIN_SUBTITLE_LENGTH = 2
const MIN_DESCRIPTION_LENGTH = 5

exports.getValidationErrorsForProject = function(title, subtitle, description, bgImage){
	
	const validationErrors = []
	
  if (title.length < MIN_TITLE_LENGTH){
		validationErrors.push("The name needs to be at least " + MIN_TITLE_LENGTH + " characters.")
  }

  if (subtitle.length < MIN_SUBTITLE_LENGTH){
		validationErrors.push("The name needs to be at least " + MIN_SUBTITLE_LENGTH + " characters.")
	}
	
	if (!description){
		validationErrors.push("The description is missing.")
	} else if (description.length < MIN_DESCRIPTION_LENGTH){
		validationErrors.push("The description needs to be at least " + MIN_DESCRIPTION_LENGTH + " characters.")
  }
  if (!bgImage) { 
    validationErrors.push("The background image is missing.")
  }
	return validationErrors
}

exports.getValidationErrorsForCollabs = function () {
	const validationErrors = []

	if (!pfp) {
			validationErrors.push = "No image provided"
		}
		if (!fullName) {
			validationErrors.push = "No Name given"
		}
		if (!pos) {
			validationErrors.push = "No position specified"
		}
		if (!para) {
			validationErrors.push = "No paragraph given"
		}
		if (!social1) {
			validationErrors.push = "No social link given"
		}
		if (!social2) {
			validationErrors.push = "No social link given"
	}
	
	return validationErrors
}