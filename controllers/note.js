exports.getNotes = async function(req, res){
	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orderId = req.params.orderId;
}

exports.addNote = async function(req, res){
	await authController.verifyToken(req).catch((error) => {
		console.error(error);
	});

	if(!req.userName) return res.status(401).send();

	const orderId = req.params.orderId;
}