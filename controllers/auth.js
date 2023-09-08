const config = require("../config");

const sheetsController = require("./sheets");

exports.auth = async function(submittedName, submittedPassword){
	let users = await sheetsController.getSheet(config.authSheetId, 'Sheet1!A:B').catch((error) => {
		console.error(error);
	});

	
	if(users?.length < 2) return;

	let index = 0;
	for(const user of users){
		index++
		//I know there's a cleaner way to do this, but splice was being a pain and I'm lazy
		if(index == 1) continue; //weird logic here - but skip the first row

		if(!user[0]?.length || !user[1]?.length) continue;
		
		if(user[0] == submittedName && user[1] == submittedPassword) return user[0];
	}

	return;
}