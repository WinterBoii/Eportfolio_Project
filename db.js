const sqlite3 = require('sqlite3')
const database = new sqlite3.Database('portfolio-database.db')
const logindb = new sqlite3.Database("login-database.db")

database.run(`
  CREATE TABLE IF NOT EXISTS  projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    bgImage TEXT
  )`
)

database.run(`
  CREATE TABLE IF NOT EXISTS collabs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profileImgLink TEXT,
    name TEXT,
    position TEXT,
    paragraph TEXT,    
    socialLink1 TEXT,
    socialLink2 TEXT,
    socialLink3 TEXT
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
    const query= "INSERT INTO  projects (title, subtitle, description, bgImage) VALUES (?,?,?,?)"
    
    const values =[title, subtitle, desc, bgImage] 

    database.run(query, values, function(error){
        callback(error)

    })
}

exports.getAllProjects = function(callback) {
  const query = `SELECT * FROM projects ORDER BY id DESC`
    
  database.all(query, function(error, projects){
      callback(error, projects)
  })
}

exports.getProjectByID = function (id, callback) { 
  const query = "SELECT * FROM projects p WHERE id = ?"
  const value = id
  
    // for single cell
    database.get(query, value, function(error, res){
        callback(error, res)
    })
}

exports.deleteProjectById = (req, res) => {
  const query = `DELETE FROM projects WHERE id =?`
  const values = [req.params.id]
  
  database.run(query, values, function (error) {
    res.status(200).send({
      message: "Project deleted",
    })
  })
}

/* -------------------------------- Collabs --------------------------------*/

exports.createCollab = (pfp, fullName, pos, para, social1, social2, social3, callback) => { 
  const query= "INSERT INTO  collabs (profileImgLink, name, position, paragraph, socialLink1, socialLink2, socialLink3) VALUES (?,?,?,?,?,?,?)"
  const values = [pfp, fullName, pos, para, social1, social2, social3] 
  console.log(social1)
  
  database.run(query, values, function (error) {
    callback(error)
  })
}

exports.getAllCollab = function(callback) {
  const query = "SELECT * FROM collabs ORDER BY id DESC"
    
  database.all(query, function(error, collabs){
      callback(error, collabs)
  })
}