const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios")

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.static("./public/"));
app.use(function(req, res, next) {
	next();
});
const { DB, note, Op } = require("./DB.js")

function checkAuth(JWT) {
	return new Promise((result, reject) => {
		axios({
		url: "http://localhost:3101/checkAuth",
		method: "post",
		headers: {
			"Content-Type": "application/json"
		},
		data: JSON.stringify({
			JWT: JWT
		})
	}).then(data => {
			if (data.error) {
				reject(data.error)
			} else {
				result(data.data)
			}
		})
	})
}

app.post("/create", async (req, res) => {

	const { JWT, name, value, id } = req.body

	if (!(JWT && name && value && id )) { return res.send({"error": "EBadData"}) }

	if (name.length > 255 || value.length > 255) { return res.send({"error": "ETooLongNote"}) }

	checkAuth(JWT).then(async data => {

		let _notes = await note.findAll({ where: {owner: data.login}})

		if(_notes[id]) {
			note.update({
				name: name,
				value: value
			}, {
				where: {
					[Op.and]: [{owner: data.login}, {id: id}]
				}
			})
		} else {
			note.build({
				owner: data.login,
				name: name,
				value: value
			}).save()
		}
	})
})

app.post("/delete", async (req, res) => {

	const { JWT, id } = req.body

	if (!(JWT && id )) { return res.send({"error": "EBadData"}) }

	checkAuth(JWT).then(async data => {
		await note.destroy({
			where: {
				owner: data.login,
				id: id
			}
		})
	})
})

app.post("/get", async (req, res) => {

	const { JWT } = req.body

	if (!JWT) { return res.send({"error": "EBadData"}) }

	checkAuth(JWT).then(async data => {
		let _notes = await note.findAll({ where: {owner: data.login}})

		if (_notes) {
			_notes = _notes.map(({ id, name, value}) => ({ id, name, value }))
			res.send({"notes": _notes})
		} else {
			res.send({"notes": []})
		}
	})
})

app.use(function(req, res) {
	res.send({"error": "INVALIDURL"});
});

DB.authenticate().then(() => {
	app.listen(process.env.PORT, () => { console.log("started on port " + process.env.PORT) });
});