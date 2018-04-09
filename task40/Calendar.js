function Calendar(container, w) {
	this.container = container;
	this.w = w;
	this.caption = document.getElementById("caption");
	this.title = document.getElementById("title");
	this.data = document.getElementById("calendar_data");
	this.cells = document.getElementsByClassName("day_cell");
	this.frontArrow = document.getElementById("left_arrow");
	this.backArrow = document.getElementById("right_arrow");
	this.controller().init();
}

Calendar.prototype.controller = function(){
	var self = this;
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var week = date.getDay();
	var cell_w = self.w / 7;
	var caption_h = self.w * 0.1;
	var init = function() {
		
		createTable(true);

		self.container.onclick = function(e) {
			dayClick(e.target);
		};

		self.frontArrow.onclick = function() {
			month -= 1;
			if (month == 0) {
				year -= 1;
				month = 12;
			}

			date.setYear(year);
			date.setMonth(month - 1);
			createTable();
		};

		self.backArrow.onclick = function() {
			month += 1;
			if(month == 13) {
				year += 1;
				month = 1;
			}

			date.setYear(year);
			date.setMonth(month - 1);
			createTable(false);
		};
	};

	var toggleShow = function() {
		if(self.container.className == "show") {
			self.container.className = "hide";
		} else {
			self.container.className = "show";
		}
	};

	var createTable = function(isNow) {
		var html = "";
		var dayName = ["日", "一", "二", "三", "四", "五", "六"];
		var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var count = 0, left = 0;
		
		date.setDate(1);
		var newWeek = date.getDay();
		date.setDate(day);
		
		if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			days[1] = 29;
		}
		
		for(var i = 0; i < 7; i++, count++) {
			if(i == 0 || i == 6) {
				html += "<span class='day_cell week_cell special_week'>" + dayName[i] + "</span>";
			} else {
				html += "<span class='day_cell week_cell'>" + dayName[i] + "</span>";
			}
		}
		
		for(var k = newWeek - 1; k >= 0; k--, count++) {
			html += "<span class='day_cell before'>" + (days[month - 2] - k) + "</span>";
		}

		for(var j = 0; j < days[month - 1]; j++, count++) {

			if(count % 7 == 0 || count % 7 == 6) {
				if(isNow && j + 1 == day) {
					html += "<span class='day_cell day_data special_week' id='selected'>" + (j + 1) + "</span>";
				} else {
					html += "<span class='day_cell day_data special_week'>" + (j + 1) + "</span>";
				}
			} else {
				if(isNow && j + 1 == day) {
					html += "<span class='day_cell day_data' id='selected'>" + (j + 1) + "</span>";
				} else {
					html += "<span class='day_cell day_data'>" + (j + 1) + "</span>";			
				}
			}
		}

		if(count % 7 != 0) {
			left = 7 - (count % 7);
		}

		for(var l = 0; l < left; l++) {
			html += "<span class='day_cell after'>" + (l + 1) + "</span>";
		}

		self.data.innerHTML = html;
		setTable();
	};

	var setTable = function() {
		caption = year + "年" + month + "月";

		self.caption.style.width = self.w + "px";
		self.caption.style.height = caption_h + "px";
		self.title.style.lineHeight = caption_h + "px";
		self.title.style.fontSize = caption_h * 0.5 + "px";
		self.data.style.width = self.w + "px";
		self.data.style.Height = self.w + "px";
		self.container.style.width = self.w + 2 + "px";
		self.container.style.height = self.w + 2 + "px";
		self.data.style.position = "absolute";
		self.data.style.top = caption_h + "px";
		for(var i = 0; i < self.cells.length; i++) {
			self.cells[i].style.width = cell_w + "px";
			self.cells[i].style.height = cell_w + "px";
			self.cells[i].style.lineHeight = cell_w + "px";
			self.cells[i].style.fontSize = caption_h * 0.5 + "px";
		}
		self.title.innerHTML = caption;
	};

	var dayClick = function(ele) {
		var oldSelect = document.getElementById("selected");
		if(ele.className.indexOf("day_data") != -1) {
			if(oldSelect) {
				oldSelect.id = "";
			}
			ele.id = "selected";
		} else if(ele.className.indexOf("before") != -1) {
			self.frontArrow.click();
		} else if(ele.className.indexOf("after") != -1) {
			self.backArrow.click();
		}

		var selected = document.getElementById("selected");
		if(selected) {
			day = selected.textContent;
		}
		date.setDate(day);
		console.log(date);
	};

	var getDateValue = function() {
		console.log(year);
		return year + "-" + month + "-" + currDay;
	};

	var setDateValue = function(year, month, day) {
		date.setMonth(month - 1);
		date.setYear(year);
		date.setDate(day);
		dayClick();
	};

	return {
		init: init,
		toggleShow: toggleShow,
		getDateValue: getDateValue,
		setDateValue: setDateValue
	};
};