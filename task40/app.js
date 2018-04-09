window.onload = function() {
	var input = document.getElementById("date_input");
	var calendar = new Calendar(document.getElementById("calendar"), 300);
	input.onclick = function() {
		calendar.controller().toggleShow();
		calendar.controller().setDateValue(2017, 12, 19);
		var dateText = calendar.controller().getDateValue();
		input.value = dateText;
	};
};
