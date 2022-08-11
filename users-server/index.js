const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios")

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.static("./public/"));
app.use(function (req, res, next) {
	next();
});
const { DB, user, Op } = require("./DB.js")

app.post("/register", async (req, res) => {

	const { login, password, email } = req.body

	if (!(login && password && email)) { return res.send({ "error": "EBadData" }); }
	// повторная проверка данных
	if (login.length > 30) { return res.send({ "error": "LoginIsTooLong" }); }
	if (login.length < 6) { return res.send({ "error": "LoginIsTooShort" }); }
	if (password.length > 30) { return res.send({ "error": "PasswordIsTooLong" }); }
	if (password.length < 6) { return res.send({ "error": "PasswordIsTooShort" }); }
	if (email.length > 100) { return res.send({ "error": "EmailIsTooLong" }); }
	if (!email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)) { return res.send({ "error": "EmailIsNotValid" }); }

	// проверка данных в бд
	const _user = await user.findOne({ where: { [Op.or]: [{ email: email }, { login: login }] } });
	if (_user) {
		if (_user.login == login) {
			return res.send({ "error": "ELoginIsBusy" });
		} else {
			return res.send({ "error": "EEmailISBusy" });
		}
	} else {
		user.build({
			login: login,
			password: password,
			email: email
		}).save();
	};
	res.send({ "status": "ok" });
})

app.post("/login", async (req, res) => {

	const { login, password } = req.body

	console.log(req.body)

	if (!(login && password)) { return res.send({ "error": "EBadData" }); }
	else {
		const _user = await user.findOne({ where: { [Op.and]: [{ login: login }, { password: password }] } });
		if (_user) {

			const token = jwt.sign({
				login: login,
				password: password
			}, process.env.JWTKEY, {
				expiresIn: "10h"
			})

			return res.send({
				"status": "ok",
				"JWT": token
			});
		} else {
			return res.send({ "error": "ENoUser" });
		}
	};
});

app.post("/checkAuth", async (req, res) => {

	const { JWT } = req.body

	if (!JWT) { return res.send({ "error": "EBadData" }) }

	try {
		const { login, password } = jwt.verify(JWT, process.env.JWTKEY)

		const _user = await user.findOne({
			where: {
				[Op.and]: [{ login: login }, { password: password }]
			}
		})
		if (_user) {
			res.send({
				"status": "ok",
				"login": login
			})
		} else {
			res.send({ "error": "ENoUser" })
		}
	} catch (e) {
		res.send({ "error": "EBadAuth" })
	}
})

app.use(function (req, res) {
	res.send({ "error": "INVALIDURL" });
});

DB.authenticate().then(() => {
	app.listen(process.env.PORT, () => { console.log("started on port " + process.env.PORT) });
});