function checkTokenExpiration(){
	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token || Date.now() > + data.expires) return true;

	return false;
}