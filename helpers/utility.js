exports.getDateString = function(){
	const date = new Date();
	return (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + "/" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes();
}