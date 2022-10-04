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
  )
`)

logindb.run(`
  CREATE TABLE IF NOT EXISTS login (
      userId INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT,
      username TEXT 
  )
`)

exports.createProject = function(title, subtitle, desc, bgImage, callback) {
    const query= "INSERT INTO  projects (title, subtitle, description, bgImage) VALUES (?,?,?,?)"
    
    const values =[title, subtitle, desc, bgImage] 

    database.run(query, values, function(error){
        callback(error)

    })
}

exports.getAllProjects = function(callback) {
  const query = "SELECT * FROM projects ORDER BY id DESC"
    
  database.all(query, function(error, projects){
      callback(error, projects)
  })
}

exports.getProjectByID = function (id, callback) { 
  const query = "SELECT * FROM projects WHERE id = ?"
  const values = [id]
  
    database.run(query, values, function(error, result){
        callback(error, result)

    })
}

exports.deleteProjectById = (req, res) => {
  const query = "DELETE FROM projects WHERE id =?"
  const values = [req.params.id]
  
  database.run(query, values, function (error) {
    res.status(200).send({
      message: "Project deleted",
    })
  })
}
