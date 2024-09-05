const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

const routes = require("./routes");
routes(app);

const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT);
console.log(`Server is listening on port ${PORT}`);