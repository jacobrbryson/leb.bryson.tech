const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

const mainController = require("./controllers/main");
app.get("/", mainController.home);
app.post("/", mainController.login);
app.get("/logout", mainController.logout);

const checkInController = require("./controllers/check-in");
app.get("/check-in", checkInController.get);

app.listen(8088);
console.log("Server is listening on port 8088");