const sqlite3 = require('sqlite3')
const database = new sqlite3.Database('portfolio-database.db')
const logindb = new sqlite3.Database("login-database.db")

database.run(`
  CREATE TABLE IF NOT EXISTS Projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    bgImage TEXT
  )`
)

database.run(`
  CREATE TABLE IF NOT EXISTS Collabs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profileImgLink TEXT,
    name TEXT,
    position TEXT,
    paragraph TEXT,    
    socialLink1 TEXT,
    socialLink2 TEXT
  )`
)

logindb.run(`
  CREATE TABLE IF NOT EXISTS login (
      userId INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT,
      username TEXT 
  )`
)

exports.createProject = function(title, subtitle, desc, bgImage, callback) {
    const query= "INSERT INTO Projects (title, subtitle, description, bgImage) VALUES (?,?,?,?)"
    
    const values =[title, subtitle, desc, bgImage] 

    database.run(query, values, function(error){
        callback(error)

    })
}

exports.getAllProjects = function(callback) {
  const query = "SELECT * FROM Projects ORDER BY id DESC"
    
  database.all(query, function(error, projects){
      callback(error, projects)
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

exports.updateProjectById = function (id, title, subtitle, desc, bgImage, callback) {
  const query = "UPDATE Projects SET title = ?, subtitle = ?, description = ?, bgImage = ? WHERE id = ?"
  const values = [title, subtitle, desc, bgImage, id]

  database.run(query, values, function (error) {
    callback(error)
  })
}

exports.deleteProjectById = (id, callback) => {
  const query = "DELETE FROM Projects WHERE id = ?"
  const values = id
  
  database.run(query, values, function (error, res) {
    callback(error, res)
  })
}

/* -------------------------------- Collabs --------------------------------*/

exports.createCollab = (pfp, fullName, pos, para, social1, social2, callback) => { 
  const query = "INSERT INTO Collabs (profileImgLink, name, position, paragraph, socialLink1, socialLink2) VALUES (?,?,?,?,?,?)"
  const values = [pfp, fullName, pos, para, social1, social2] 
  
  database.run(query, values, function (error) {
    callback(error)
  })
}

exports.getAllCollab = function(callback) {
  const query = "SELECT * FROM Collabs ORDER BY id DESC"
    
  database.all(query, function(error, Collabs){
      callback(error, Collabs)
  })
}