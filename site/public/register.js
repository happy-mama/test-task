let login, pass, passRep, email
let Elogin, Epass, EpassRep, Eemail, Ebutton
let BReg

window.onload = function() {
	login = document.getElementById("login");
	pass = document.getElementById("pass");
	passRep = document.getElementById("passRep");
	email = document.getElementById("email");

	Elogin = document.getElementById("Elogin");
	Epass = document.getElementById("Epass");
	EpassRep = document.getElementById("EpassRep");
	Eemail = document.getElementById("Eemail")
	Ebutton = document.getElementById("Ebutton")

	BReg = document.getElementById("reg")
}

function checkValues() {
	let code = true
	Elogin.textContent = ""
	Epass.textContent = ""
	EpassRep.textContent = ""
	Eemail.textContent = ""
	Ebutton.textContent = ""

	if (login.value.toString().length > 30) {
		Elogin.textContent = "Login is too long"
		code = false
	}
	if (login.value.toString().length < 6) {
		Elogin.textContent = "Login is too short"
		code = false
	}
	if (pass.value.toString().length > 30) {
		Epass.textContent = "Password is too long"
		code = false
	}
	if (pass.value.toString().length < 6) {
		Epass.textContent = "Password is too short"
		code = false
	}
	if (pass.value !== passRep.value) {
		EpassRep.textContent = "Passwords are not equal"
		code = false
	}
	if (email.value.toString().length > 100) {
		Eemail.textContent = "Email is too long"
		code = false
	}
	if (!email.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)) {
		Eemail.textContent = "Email is not valid"
		code = false
	}
	return code
}

async function register() {
	fetch("http://localhost:3101/register", {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			login: login.value.toString(),
			password: pass.value.toString(),
			email: email.value.toString()
		})
	}).then((responce) => {
		responce.json().then(data => {
			if (!data.status) {
				BReg.disabled = false
				if (data.error == "ELoginIsBusy") {
					return Elogin.textContent = "Login is busy!"
				}
				if (data.error == "EEmailISBusy") {
					return Eemail.textContent = "Email is busy!"
				}
				Ebutton.textContent = "Error, try again with other data"
			} else {
				window.location.replace("/login")
			}
		})
	})
}

function init() {
	if (checkValues()) {
		console.log("Seneding Request")
		register()
		BReg.disabled = true
	}
}