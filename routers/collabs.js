const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: false }))


const multer = require('multer')
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
const upload = multer({ storage: storage })


router.get("/createCollab", (req, res) => {
	if (req.session.isLoggedIn) {
    res.render('createCollab.hbs') 
    return
  } else {
    res.render('/login.hbs')
    return
  }
});

router.post("/createCollab", upload.any(), (req, res) => {
	const pfp = req.body.pfp
  console.log(pfp)
	const fullName = req.body.name
	const pos = req.body.position
	const para = req.body.paragraph
	const social1 = req.body.socialmedia1
	const social2 = req.body.socialmedia2
  const social3 = req.body.socialmedia3

	if (!req.session.isLoggedIn) {
		return res.status(401).send("Unauthorized");
	} else {
		// if (!pfp) {
		// 	pfp = "/public/Images/pfp-placeholder.png";
		// }
		// if (!fullName) {
		// 	fullName = "No Name given";
		// }
		// if (!pos) {
		// 	pos = "No position specified";
		// }
		// if (!para) {
		// 	para = "No paragraph given";
		// }
		// if (!social1) {
		// 	social1 = "https://img.icons8.com/color/344/twitter--v1.png";
		// }
		// if (!social2) {
		// 	social2 = "https://img.icons8.com/fluency/344/facebook-new.png";
		// }
		// if (!social3) {
		// 	social3 = "https://img.icons8.com/fluency/344/instagram-new.png";
		// }
		db.createCollab(
			pfp,
			fullName,
			pos,
			para,
			social1,
			social2,
			social3,
			function (err) {
				if (err) {
					const errors =
						"Could not upload to the server, please try again later";
					const model = {
						errors,
					};
					res.render("createCollab.hbs", model);
					return;
				} else {
					res.redirect('collaboration');
				}
			}
		);
	}
});

module.exports = router;
