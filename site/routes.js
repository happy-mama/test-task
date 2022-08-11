const express = require("express");
const jwt = require("jsonwebtoken")

const router = express.Router();

router.use(express.json());

let DB = null;
router.init = function (db) { DB = db };

// функция аунтефикации
auth = (req, res, next) => {
	const token = req.body.token || req.query.token

	if (!token) { return res.send("You need a token for auth.") }

	try {
		const decoded = jwt.verify(token, process.env.JWTKEY)
		req.user = decoded
	} catch (e) {
		return res.send("Invalid token")
	}

	return next()
}

router.get("/", (req, res) => {
	res.render("index");
})

router.get("/register", (req, res) => {
	res.render("register")
})

router.get("/login", (req, res) => {
	res.render("login")
})

router.get("/notes", auth, (req, res) => {
	res.render("notes")
})

module.exports = router;