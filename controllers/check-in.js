const config = require("../config");
const authController = require("./auth");
const sheetsController = require("./sheets");
const utilityHelper = require("../helpers/utility");
const orderSheet = "Sheet1";

exports.get = async function(req, res){
	return res.render("pages/check-in");
}

exports.listOrders = async function(req, res){
	const search = req.query.search;

	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orders = await getOrders(search).catch((error) => {
		console.error(error)
	});

	if(!orders) return res.status(500).json({message: "Failed to get orders"});

	return res.render("partials/check-in/orders", {orders: orders });
}

exports.checkInOrder = async function(req, res){
	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orderId = req.params.orderId;
	const partialAmount = req.params.partialAmount;

	if(isNaN(orderId)) return res.status(500).json({message: "Invalid order id"});

	//Need the raw sheet data so we can get the correct row data
	const orders = await sheetsController.getSheet(config.orderSheetId, orderSheet).catch((error) => {
		throw(error);
	});

	let index = null;
	for(i = 0; i < orders.length; i++){
		if(orders[i][0] == orderId){
			index = i;
			break;
		}
	}

	if(index == null) return res.status(500).json({ message: "Unable to locate order information to update"});
	
	const amount = !isNaN(partialAmount) ? partialAmount : orders[index][32];
	const results = await sheetsController.updateSheet(
		config.orderSheetId, orderSheet + `!AL${(index + 1)}:AP${(index + 1)}`, 
		[[utilityHelper.getDateString(),req.userName, amount, '', '']]
	).catch((error) => {
		console.error(error);
	});

	if(!results) return res.status(500).json({ message: "Failed to update order"});

	return res.send();
}

exports.undoCheckInOrder = async function(req, res){
	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orderId = req.params.orderId;
	if(isNaN(orderId)) return res.status(500).json({message: "Invalid order id"});

	//Need the raw sheet data so we can get the correct row data
	const orders = await sheetsController.getSheet(config.orderSheetId, orderSheet).catch((error) => {
		throw(error);
	});

	let index = null;
	for(i = 0; i < orders.length; i++){
		if(orders[i][0] == orderId){
			index = i;
			break;
		}
	}

	if(index == null) return res.status(500).json({ message: "Unable to locate order information to update"});
	
	const results = await sheetsController.updateSheet(
		config.orderSheetId, orderSheet + `!AL${(index + 1)}:AP${(index + 1)}`, 
		[['','','',utilityHelper.getDateString(),req.userName]]
	).catch((error) => {
		console.error(error);
	});

	if(!results) return res.status(500).json({ message: "Failed to update order"});

	res.json(true);
}

async function getOrders(search){
	const orders = await sheetsController.getSheet(config.orderSheetId, orderSheet).catch((error) => {
		throw(error);
	});

	let filteredOrderArray = [];

	for(const order of orders){
		if(!order[0]?.length || isNaN(order[0])) continue;

		if(
			order[0].includes(search)
			|| order[4].includes(search)
			|| order[5].includes(search)
			|| order[12].includes(search)){
				filteredOrderArray.push(order);
			}
	}

	return filteredOrderArray;
}

