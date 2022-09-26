const sqlite3 = require('sqlite3')
const database = new sqlite3.Database("portfolio-database.database")
const logindb= new sqlite3.Database("logindb.database")

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

exports.createProject = function(title, subtitle, description, bgImage,callback) {
    const query= "INSERT INTO  projects (title, subtitle, description, bgImage) VALUES (?,?,?,?)"
    
    const values =[title, subtitle, description, bgImage] 

    database.run(query, values, function(error){
        callback(error)

    })
}

exports.getAllProjects = function(callback) {
  const query = " SELECT * FROM projects ORDER BY id  DESC;"
    
  database.all(query,function(error, Projects){
      callback(error, Projects)
  })
}

exports.getProject = function (id, callback) { 
  const query = "SELECT * FROM projects WHERE id = ?"
  const values = [id]
  
    database.run(query, values, function(error, result){
        callback(error, result)

    })
}