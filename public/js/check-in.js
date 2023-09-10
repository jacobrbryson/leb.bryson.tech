let ORDER_ID;
const PARTIAL_MODAL = new bootstrap.Modal(document.getElementById('partialModal'));

function addFormEvents(){
	const searchForm = document.getElementById("search_form");

	if(searchForm.attachEvent){
		searchForm.attachEvent("submit", function(event){
			event.preventDefault();
			searchForOrders();
		});
	}else{
		searchForm.addEventListener("submit", function(event){
			event.preventDefault();
			searchForOrders();
		});
	}

	const partialForm = document.getElementById("partial_form");

	if(partialForm.attachEvent){
		partialForm.attachEvent("submit", function(event){
			event.preventDefault();
			partialCheckIn();
		});
	}else{
		partialForm.addEventListener("submit", function(event){
			event.preventDefault();
			partialCheckIn();
		});
	}

	const noteForm = document.getElementById("note_form");

	if(noteForm.attachEvent){
		noteForm.attachEvent("submit", function(event){
			event.preventDefault();
			addNote();
		});
	}else{
		noteForm.addEventListener("submit", function(event){
			event.preventDefault();
			addNote();
		});
	}
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

function checkIn(orderId, amount){
	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token) logout();

	const xhr = new XMLHttpRequest();

	const url = `check-in/orders/${orderId}/check-in/${amount ? amount : ''}`;
	
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Authorization", "Bearer " + data.token);

	xhr.onreadystatechange = function () {
		if(this.status == 401) return logout();

		if(this.status !== 200){
			//Show some dialog
			return;
		} 

		listOrders();
	}

	xhr.send();
}

function undoCheckIn(orderId){
	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token) logout();

	const xhr = new XMLHttpRequest();

	const url = `check-in/orders/${orderId}/undo-check-in`;
	
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Authorization", "Bearer " + data.token);

	xhr.onreadystatechange = function () {
		if(this.status == 401) return logout();

		if(this.status !== 200){
			//Show some dialog
			return;
		} 

		listOrders();
	}

	xhr.send();
}

function partialCheckInModal(orderId){
	ORDER_ID = orderId;
	PARTIAL_MODAL.show();
}

function partialCheckIn(){
	const partialAmount = document.getElementById("partialAmount").value;
	
	PARTIAL_MODAL.hide();

	checkIn(ORDER_ID, partialAmount);

	document.getElementById("partialAmount").value = '';
}

function notesModal(orderId){
	ORDER_ID = orderId;
	getNotes(orderId)
	const modal = new bootstrap.Modal(document.getElementById('notesModal'));
	modal.show();
}

function getNotes(orderId){
	const notesContainer = document.getElementById("notes_container");
	notesContainer.innerHTML = "Loading notes...";

	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token) logout();

	const xhr = new XMLHttpRequest();

	const url = `check-in/orders/${orderId}/notes`;
	
	xhr.open("GET", url, true);

	xhr.setRequestHeader("Authorization", "Bearer " + data.token);

	xhr.onreadystatechange = function () {
		if(this.status == 401) return logout();

		if(this.status !== 200){
			notesContainer.innerHTML = "Failed to note data!";
			return;
		} 

		notesContainer.innerHTML = this.responseText;
	}

	xhr.send();
}

function addNote(){
	const orderId = ORDER_ID;
	const note = document.getElementById("note").value;

	const data = JSON.parse(localStorage.getItem("data") || null);
	if(!data?.token) logout();

	const xhr = new XMLHttpRequest();

	const url = `check-in/orders/${orderId}/notes`;
	
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Authorization", "Bearer " + data.token);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function () {
		if(this.status == 401) return logout();

		if(this.status !== 200){
			//Show some dialog
			return;
		}

		document.getElementById("note").value = "";
		getNotes(orderId);
		listOrders();
	}

	xhr.send(JSON.stringify({note: note}));
}

function logout(){
	window.location.replace("/logout");
}

addFormEvents();
if(checkTokenExpiration()) logout();

function htmlSpinner(){
	let html = `<div class="spinner-border spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
	return html;
}