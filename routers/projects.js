const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))

const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, 'public/Images/')
  },
  filename: (req, file, cb) => { 
    console.log(file)
    const fileName = Date.now() + path.extname(file.originalname)
    req.filePath = fileName
    cb(null, fileName)
  }
})
const upload = multer({storage: storage})


router.post('/createProject', upload.single('image'), (req, res) => { 
  const title = req.body.title
  const subtitle = req.body.subtitle
  const desc = req.body.description
  const bgImage = req.filePath
  
  db.createProject(title, subtitle, desc, bgImage, function (err) { 
    if (err){
      const errors = "could not upload to the server, please try again later"
      const model = {
        errors
      }
      res.render('/', model)     
      return
      
    } else {
      res.redirect('/')
    }
  })
})

// function auth(req, res, next) {
//     if (req.query.admin === 'true') {
//         req.admin = true
//         next()
//     } else {
//         res.send(403)
//     }
// }

module.exports = router