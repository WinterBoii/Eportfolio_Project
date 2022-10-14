const sqlite3 = require('sqlite3')
const database = new sqlite3.Database('portfolio-database.db')

database.run(`
  CREATE TABLE IF NOT EXISTS Projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    backgroundImage TEXT
  )`
)

database.run(`
  CREATE TABLE IF NOT EXISTS Collaboration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profileImageLink TEXT,
    name TEXT,
    position TEXT,
    paragraph TEXT,    
    twitterLink TEXT,
    facebookLink TEXT
  )`
)

database.run(`
  CREATE TABLE IF NOT EXISTS Feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postname TEXT,
    subject TEXT,
    feedbackContent TEXT
  )
`)

exports.createProject = function(title, subtitle, description, backgroundImage, callback) {
  const query= "INSERT INTO Projects (title, subtitle, description, backgroundImage) VALUES (?,?,?,?)"  
  const values = [title, subtitle, description, backgroundImage] 
  
  database.run(query, values, function(error){
    callback(error)
  })
}

exports.getAllProjects = function(callback) {
  const query = "SELECT * FROM Projects ORDER BY id DESC"
    
  database.all(query, function(error, res){
    callback(error, res)
  })
}

exports.getProjectByID = function (id, callback) { 
  const query = "SELECT * FROM Projects WHERE id = ? LIMIT 1"
  const value = id
  
  // for single cell
  database.get(query, value, function(error, res){
    callback(error, res)
  })
}

exports.updateProjectById = function (id, title, subtitle, description, backgroundImage, callback) {
  const query = "UPDATE Projects SET title = ?, subtitle = ?, description = ?, backgroundImage = ? WHERE id = ?"
  const values = [title, subtitle, description, backgroundImage, id]

  database.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteProjectById = function (id, callback) {
  const query = "DELETE FROM Projects WHERE id = ?"
  const values = id
  
  database.run(query, values, function (error, res) {
    callback(error, res)
  })
}

/* -------------------------------- Collaboration --------------------------------*/

exports.createCollaboration = function (profileImageLink, name, position, paragraph, twitterLink, facebookLink, callback) { 
  const query = "INSERT INTO Collaboration (profileImageLink, name, position, paragraph, twitterLink, facebookLink) VALUES (?,?,?,?,?,?)"
  const values = [profileImageLink, name, position, paragraph, twitterLink, facebookLink] 
  
  database.run(query, values, function (error) {
    callback(error)
  })
}

exports.getAllCollaborations = function(callback) {
  const query = "SELECT * FROM Collaboration ORDER BY id DESC"
    
  database.all(query, function(error, res){
      callback(error, res)
  })
}

exports.getCollaborationByID = function (id, callback) { 
  const query = "SELECT * FROM Collaboration WHERE id = ? LIMIT 1"
  const value = id
  
  // for single cell
  database.get(query, value, function(error, res){
    callback(error, res)
  })
}

exports.updateCollaborationById = function (id, profileImageLink, name, position, paragraph, twitterLink, facebookLink, callback) { 
  const query = "UPDATE Collaboration SET profileImageLink = ?, name = ?, position = ?, paragraph = ?, twitterLink = ?, facebookLink = ? WHERE id = ?"
  const value = [profileImageLink, name, position, paragraph, twitterLink, facebookLink, id]

  database.run(query, value, function (error) { 
    callback(error)
  })
}

exports.deleteCollaborationById = function (id, callback) {
  const query = "DELETE FROM Collaboration WHERE id = ?"
  const values = id
  
  database.run(query, values, function (error, res) {
    callback(error, res)
  })
}

/* -------------------------------- guestbook --------------------------------*/
exports.getAllFeedback = function(callback) {
  const query = "SELECT * FROM Feedback ORDER BY id  DESC"
    
  database.all(query,function(error, feedback){
    callback(error, feedback)
  })
}

exports.getFeedbackById = function(id, callback){
  const query = "SELECT * FROM Feedback WHERE id = ?"
  const values = id

  database.run(query, values, function(error, res){
    callback(error, res)
  })
}


exports.createFeedback = function(postname, subject, feedbackContent, callback){
  const query= "INSERT INTO  Feedback (postname, subject, feedbackContent) VALUES (?,?,?)"  
  const values =[postname, subject, feedbackContent] 

  database.run(query, values, function(error){
    callback(error)
  })
}

exports.getUpdateFeedbackById = function(id, callback){
  const query = "SELECT * FROM Feedback WHERE id = ?"
  const values = id
  
  database.get(query, values, function(error, res){
    callback(error, res)
  })
}

exports.updateFeedbackById = function(newName, newSubject, newFeedback, id, callback){

  const query = "UPDATE Feedback SET postname = ?, subject = ?, feedbackContent = ? WHERE id = ?"
  const values = [newName, newSubject, newFeedback, id]

  database.run(query, values,function(error){
    callback(error) 
  })
}

exports.deleteFeedbackById = function(id, callback){
  const query = "DELETE FROM Feedback WHERE id = ?"
  const values = id
  
  database.run(query, values, function(error){
    callback(error)
  })
}