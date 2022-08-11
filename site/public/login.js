let login, pass
let Elogin, Epass
let Blog, BElog

window.onload = function () {
	login = document.getElementById("login");
	pass = document.getElementById("pass");

	Elogin = document.getElementById("Elogin");
	Epass = document.getElementById("Elogin");

	Blog = document.getElementById("log")
	BElog = document.getElementById("Elog")
}

function _login() {
	fetch("http://localhost:3101/login", {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			login: login.value.toString(),
			password: pass.value.toString()
		})
	}).then((responce) => {
		responce.json().then(data => {
			if (data.error) {
				Blog.disabled = false
				if (data.error == "ENoUser") {
					BElog.textcontent = "Wrong auth data"
				}
			} else {
				window.location.replace("/notes?" + new URLSearchParams({"token": data.JWT}))
			}
		})
	})
}

function init() {
	Blog.disabled = true
	BElog.textcontent = ""
	_login()
}