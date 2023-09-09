const form = document.getElementById("search_form");
if(form.attachEvent){
	form.attachEvent("submit", function(event){
		event.preventDefault();
		searchForOrders();
	});
}else{
	form.addEventListener("submit", function(event){
		event.preventDefault();
		searchForOrders();
	});
}

function searchForOrders(){
	listOrders();
}

function listOrders(){
	const orderContainer = document.getElementById("orders");
	orderContainer.innerHTML = "Searching for orders...";

	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token) logout();

	const xhr = new XMLHttpRequest();

	const search = document.getElementById("search").value;
	const url = `check-in/orders` + (search?.length ? `?search=${search}` : ``);
	
	xhr.open("GET", url, true);

	xhr.setRequestHeader("Authorization", "Bearer " + data.token);
	// function execute after request is successful
	xhr.onreadystatechange = function () {
		if(this.status == 401) return logout();

		if(this.status !== 200){
			orderContainer.innerHTML = "Failed to get orders data!";
			return;
		} 

		orderContainer.innerHTML = this.responseText;
	}
	// Sending our request
	xhr.send();
}

function logout(){
	window.location.replace("/logout");
}

listOrders();