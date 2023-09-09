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
	const search = document.getElementById("search").value;

	const orderContainer = document.getElementById("orders");
	orderContainer.innerHTML = search ? "Searching for orders..." : "Enter a value in the search field above to begin...";

	if(!search) return;

	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token) logout();

	const xhr = new XMLHttpRequest();

	
	const url = `check-in/orders` + (search?.length ? `?search=${search}` : ``);
	
	xhr.open("GET", url, true);

	xhr.setRequestHeader("Authorization", "Bearer " + data.token);

	xhr.onreadystatechange = function () {
		if(this.status == 401) return logout();

		if(this.status !== 200){
			orderContainer.innerHTML = "Failed to get orders data!";
			return;
		} 

		orderContainer.innerHTML = this.responseText;
	}

	xhr.send();
}

function logout(){
	window.location.replace("/logout");
}

if(checkTokenExpiration()) logout();