const config = require("../config");
const sheetsController = require("./sheets");
const authController = require("./auth");
const utilityHelper = require("../helpers/utility");

exports.getNotes = async function(req, res){
	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orderId = req.params.orderId;

	const notes = await sheetsController.getSheet(config.orderSheetId, "Notes").catch((error) => {
		console.error(error);
	})

	if(!notes) return res.status(500).json({message: "Unable to get notes"});

	const filteredNotes = []
	for(const note of notes){
		if(note[0] == orderId){
			filteredNotes.push(note);
		}
	}

	return res.render("partials/check-in/notes", {notes: filteredNotes });
}

exports.addNote = async function(req, res){
	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orderId = req.params.orderId;
	const body = req.body;

	const resource = {
		values: [
			[orderId, utilityHelper.getDateString(), req.userName, body.note]
		]
	}

	const appendResults = await sheetsController.appendSheet(config.orderSheetId, "Notes", resource).catch((error) => {
		console.error(error);
	})

	if(!appendResults) return res.status(500).json({message: "Unable to insert note"});

	const orders = await sheetsController.getSheet(config.orderSheetId, "Sheet1").catch((error) => {
		throw(error);
	});

	let index = null;
	for(i = 0; i < orders.length; i++){
		if(orders[i][0] == orderId){
			index = i;
			break;
		}
	}

	const count = orders[index][44] ? orders[index][44]++ : 1;
	const orderResults = await sheetsController.updateSheet(
		config.orderSheetId, `Sheet1!AS${(index + 1)}`, 
		[[count]]
	).catch((error) => {
		console.error(error);
	});

	if(!orderResults) return res.status(500).json({ message: "Failed to update order"});

	return res.send();
}