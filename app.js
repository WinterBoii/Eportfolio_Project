const express = require("express");
const expressHandlebars = require("express-handlebars");
const path = require("path");

const app = express();

const eport = require("./routers/eport");

app.engine("hbs", expressHandlebars.engine({
		extname: "hbs",
		defaultLayout: "main",
	})
);

app.use("/public", express.static(path.join(__dirname, "/public")));

app.use(eport);

app.listen(3000);
