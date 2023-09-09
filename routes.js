const mainController = require("./controllers/main");
const checkInController = require("./controllers/check-in");

module.exports = function(app) {
	app.get("/", mainController.home);
	app.post("/", mainController.login);
	app.get("/logout", mainController.logout);


	app.get("/check-in", checkInController.get);
	app.get("/check-in/orders", checkInController.listOrders);
}

