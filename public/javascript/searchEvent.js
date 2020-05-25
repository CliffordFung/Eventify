
function searchEvent(filename) {
    // console.log(‘entering ajax’);
    // console.log(‘entered string: ’, filename);
    showEvents(receivedFilteredEventsJson)
}

function showEvents(data) {
	// console.log("files: ", data);
	// console.log("entered string: ", this.name);
	// adapted search from: https://www.w3schools.com/howto/howto_js_filter_lists.asp

	// Declare variables
	var li, a, txtValue;
	var input = document.getElementById('eventSearch');
	var filter = input.value.toUpperCase();
	var div = document.getElementById("sidebar-list");
	li = div.getElementsByTagName('li');

	// Loop through all list items, and hide those who don't match the search query
	// console.log("li length: ", li.length);

	for (var i = 0; i < li.length; i++) {
		// console.log(document.getElementById('sidebar-list').getElementsByTagName("li")[i]);
		a = document.getElementById('sidebar-list').getElementsByTagName("li")[i];
		// console.log(a);
		txtValue = a.textContent || a.innerText;
		// console.log("txtValue: ", txtValue);
		
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}
