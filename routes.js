const mainController = require("./controllers/main");
const checkInController = require("./controllers/check-in");

module.exports = function(app) {
	app.get("/", mainController.home);
	app.post("/", mainController.login);
	app.get("/logout", mainController.logout);


	app.get("/check-in", checkInController.get);
	app.get("/check-in/orders", checkInController.listOrders);
	app.post("/check-in/orders/:orderId/check-in", checkInController.checkInOrder);
	app.post("/check-in/orders/:orderId/check-in/:partialAmount", checkInController.checkInOrder);
	app.post("/check-in/orders/:orderId/undo-check-in", checkInController.undoCheckInOrder);
}