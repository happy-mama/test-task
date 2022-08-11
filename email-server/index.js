const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const nodemailer = require('nodemailer');
const app = express();

const queue = []
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.LOGIN,
		pass: process.env.PASS
	}
})

const mailOptions = {
	from: "notes@gmail.com",
	to: "",
	subject: "Thank you for registration",
	text: ""
}

app.use(cors());
app.use(express.json())
app.use(express.static("./public/"));
app.use(function (req, res, next) {
	next();
});
app.post("/", (req, res) => {

	const { login, email } = req.body

	if (!(login && email)) { return res.send({ "error": "EBadData" }) }

	queue.push({ login: login, email: email })
	res.send({ "status": "ok" })
})

app.use(function (req, res) {
	res.send({ "error": "INVALIDURL" });
});


app.listen(process.env.PORT, () => {
	console.log("started on port " + process.env.PORT)

	setInterval(() => {

		if (queue.length > 0) {
			mailOptions.to = "Your account is " + queue[0].email
			mailOptions.text = queue[0].login

			transporter.sendMail(mailOptions, function(e, info) {
				if (e) {
					console.log(e)
				} else {
					console.log("Email sent: " + info.response)
				}
			})
			queue.shift()
		}
	}, 1000)
});