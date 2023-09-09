const config = require("../config");
const authController = require("./auth");
const sheetsController = require("./sheets");

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

async function getOrders(search = ""){
	const orders = await sheetsController.getSheet(config.orderSheetId, "Sheet1").catch((error) => {
		throw(error);
	});

	orders.shift();//Removes first header
	orders.shift();//Removes the second header

	let filteredOrderArray = [];

	if(search == "") return filteredOrderArray;//remove this line to make empty searches return all

	for(const order of orders){
		if(!order[0]?.length) continue;

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