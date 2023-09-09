const config = require("../config");
const sheetsController = require("./sheets");
const jwt = require("jsonwebtoken");

exports.auth = async function(submittedName, submittedPassword){
	let users = await sheetsController.getSheet(config.authSheetId, 'Sheet1!A:B').catch((error) => {
		console.error(error);
	});

	if(users?.length < 2) return;

	users.shift(); //removes the header
	for(const user of users){
		if(!user[0]?.length || !user[1]?.length) continue;
		
		if(user[0] == submittedName && user[1] == submittedPassword) return user[0];
	}

	return;
}

exports.verifyToken = async function(req){
	if (!req.headers.authorization || req.headers.authorization.indexOf("Bearer ") === -1) {
    throw({ message: "Missing Authorization Header" });
  }
  
  const base64Credentials = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(base64Credentials, config.jwt.secret);

    const userName = decoded.userName;

    if (decoded.exp < Math.floor(Date.now())) {
      throw({ message: "Token Expired" });
    }

    req.userName = userName
  } catch (err) {
    throw({ message: err.message });
  }
}