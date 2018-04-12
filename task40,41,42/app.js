//window.onload = function() {
	var input = document.getElementById("date_input");
	var multiInput = document.getElementById("date_multi_input");
	var calendar_ele = document.getElementById("calendar");

	var calendar = new Calendar(calendar_ele, 250);
	
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
		calendar.controller().setMulti(false);
		calendar.controller().setFun(callBack1);
		calendar.controller().toggleShow();

		if(e.target.value) {
			var DayList = e.target.value.split("-");
			calendar.controller().setDateValue(DayList, false);
		}
		callBack1();
	};

	multiInput.onclick = function(e) {
		calendar.controller().setFun(callBack2);
		calendar.controller().setMulti(true);

		calendar.controller().toggleShow();

		if(e.target.value) {
			var DayList = e.target.value.split("——");
			var start = DayList[0].split("-");
			var end = DayList[1].split("-");

			calendar.controller().setDateValue(start, false, end);
		}
		callBack2();
	};
//};
