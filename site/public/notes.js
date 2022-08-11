const queryString = window.location.search;
const URLparams = new URLSearchParams(queryString)

let notesId = 0
let _root, Elog

window.onload = function() {
	_root = document.getElementById("notes")

	Elog = document.getElementById("Elog")

	getNotes()
}

function _fetch(url, body) {
	return new Promise((result) => {
		fetch("http://localhost:3102" + url, {
			method: "POST",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		}).then((responce) => {
			responce.json().then(data => {
				result(data)
			})
		})
	})
}

function generateNotes(notes) {
	notes.forEach(element => {
		if (element.id > notesId) { notesId = element.id }

		let note = document.createElement("div")
		note.id = element.id
		note.className = "note"

		let name = document.createElement("input")
		name.className = "name"
		name.value = element.name
		name.placeholder = "Name of the note"

		let br = document.createElement("br")

		let value = document.createElement("textarea")
		value.className = "value"
		value.value = element.value
		value.placeholder = "Value of the note"
		
		let Dbutton = document.createElement("button")
		Dbutton.className = "delete"
		Dbutton.textContent = "Delete note"
		Dbutton.setAttribute("onclick", `deleteNote(${note.id})`)

		let Sbutton = document.createElement("button")
		Sbutton.textContent = "Save note"
		Sbutton.setAttribute("onclick", `saveNote(${note.id})`)

		note.appendChild(name)
		note.appendChild(br)
		note.appendChild(value)
		note.appendChild(br)
		note.appendChild(Dbutton)
		note.appendChild(Sbutton)

		_root.appendChild(note)
	});
}

function getNotes() {

	let child = _root.lastElementChild
	while (child) {
		_root.removeChild(child)
		child = _root.lastElementChild
	}

	_fetch("/get", {JWT: URLparams.get("token")}).then(data => {
		generateNotes(data.notes)
	})
}

function deleteNote(id) {
	_fetch("/delete", {
		JWT: URLparams.get("token"),
		id: id
	})

	_root.removeChild( document.getElementById(id) )
}

function createNote() {
	notesId++
	generateNotes([{id: notesId, name: "", value: ""}])
}

function saveNote(id) {
	let note = document.getElementById(id)

	let name = note.querySelector(".name")

	let value = note.querySelector(".value")

	_fetch("/create", {
		JWT: URLparams.get("token"),
		name: name.value,
		value: value.value,
		id: note.id
	}).then(data => {
		if (data.error) {
			if (data.error == "ETooLongNote") {
				Elog.textContent = "Note Length is Too Much"
			}
		} else {
			Elog.textContent = ""
		}
	})
}

function logOut() {
	window.location.replace("/")
}