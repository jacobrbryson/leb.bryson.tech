const data = JSON.parse(localStorage.getItem("data") || null);
const name = data?.name ? data.name : "";
document.getElementById("name").value = name;

const form = document.getElementById("signInForm");
if(form.attachEvent){
	form.attachEvent("submit", updateLocalStorage);
}else{
	form.addEventListener("submit", updateLocalStorage);
}

function updateLocalStorage(){
	document.getElementById("submit").disabled = true;
	let data = {
		name: document.getElementById("name").value,
		token: document.getElementById("token")?.value,
		expires: document.getElementById("expiresIn")?.value ? Date.now() + document.getElementById("expiresIn")?.value : null
	};
	localStorage.setItem("data", JSON.stringify(data));
}

if(document.getElementById("token")?.value){
	updateLocalStorage();
	window.location.replace("/check-in");
}