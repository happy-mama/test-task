const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");

const app = express();

app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views/", ""));
const routes = require("./routes.js");
app.use("/", routes);
app.use(express.static("./public/"));
app.use(function(req, res, next) {
	next();
});
app.use(function(req, res) {
	res.render("InvalidRoutePage");
});

DB = require("./DB.js")
DB.authenticate().then(() => {
	routes.init(DB);
	app.listen(process.env.PORT, () => { console.log("started on post 3100") })
})