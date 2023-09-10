const config = require("../config");
const { Auth, google } = require('googleapis');

exports.getSheet = async function(sheetId, range){
	const auth = new Auth.GoogleAuth({
		keyFile: config.keyFile,
		scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
	});

	const client = await auth.getClient().catch((error) => {
		throw error;
	});

	const sheets = google.sheets({version: 'v4', auth: client});

	const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range
  }).catch((error) => {
		throw error;
	});

  return(res?.data?.values);
}

exports.updateSheet = async function(sheetId, range, values){
	const auth = new Auth.GoogleAuth({
		keyFile: config.keyFile,
		scopes: "https://www.googleapis.com/auth/spreadsheets",
	});

	const client = await auth.getClient().catch((error) => {
		throw error;
	});

	const sheets = google.sheets({version: 'v4', auth: client});

	const res = await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: range,
		valueInputOption: "USER_ENTERED",
		resource: { range: range, majorDimension: "ROWS", values: values },
  }).catch((error) => {
		throw error;
	});

  return(res);
}