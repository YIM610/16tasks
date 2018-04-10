window.onload = function() {
	var input = document.getElementById("date_input");
	var multiInput = document.getElementById("date_multi_input");

	var calendar = new Calendar(document.getElementById("calendar"), 250);
	
	function callBack1() {
		var dateText = calendar.controller().getDateValue();
		if(dateText) {
			input.value = dateText;
		}
	}

	function callBack2() {
		var dateText = calendar.controller().getDateValue();
		if(dateText) {
			multiInput.value = dateText[0] + "——" + dateText[1];
		}
	}


	input.onclick = function(e) {
		if(e.target.value) {
			var DayList = e.target.value.split("-");
			calendar.controller().setDateValue(DayList[0], DayList[1], DayList[2], false);
		}

		calendar.controller().setMulti(false);
		calendar.controller().setFun(callBack1);
		calendar.controller().toggleShow();
		callBack1();
	};

	multiInput.onclick = function(e) {
		if(e.target.value) {
			var DayList = e.target.value.split("——");
			DayList = DayList[0].split("-");

			calendar.controller().setDateValue(DayList[0], DayList[1], DayList[2], false);
		}

		calendar.controller().setFun(callBack2);
		calendar.controller().setMulti(true);

		calendar.controller().toggleShow();
		callBack2();
	};
};
