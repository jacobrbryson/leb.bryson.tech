const config = require("../config");
const authController = require("./auth");
const jwt = require("jsonwebtoken");

exports.home = async function(req, res){
	let payload = {error: null, jwt: null};
	res.render("pages/home", payload);
}

exports.login = async function(req, res){
	let payload = {error: null, jwt: null};

	const body = req.body;

	const submittedName = body?._name;
	const submittedPassword = body?._password;

	if(!submittedName?.length || !submittedPassword?.length){
		payload.error = { message: "Invalid name/password combination" }
		return res.render("pages/home", payload);
	}

	const userName = await authController.auth(submittedName, submittedPassword);

	if(!userName){
		payload.error = { message: "Invalid name or password" }
		return res.render("pages/home", payload);
	}

	try{
		const token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + config.jwt.expireInSeconds,
			userName: userName
			},
			config.jwt.secret
		);

		payload.jwt = {
			token: token,
			expiresIn: config.jwt.expireInSeconds
		};
	
		return res.render("pages/home", payload);
	}catch(error){
		console.error(error);
		payload.error = { message: "Unable to issue auth token" }
		return res.render("pages/home", payload);
	}
}

exports.logout = async function(req, res){
	res.render("pages/logout");
}