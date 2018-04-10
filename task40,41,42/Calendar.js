function Today() {
	this.date = new Date();

	this.year = null;
	this.month = null;
	this.day = null;
	this.week = null;

	this.setData();
}

Today.prototype = {
	setData: function() {
		this.year = this.date.getFullYear();
		this.month = this.date.getMonth() + 1;
		this.day = this.date.getDate();
		this.week = this.date.getDay();
	},

	setToday: function(y, m, d) {
		if(y == null) {
			y = this.year;
		}

		if(m == null) {
			m = this.month;
		}

		if(d == null) {
			d = this.day;
		}

		if(m == 0) {
			m = 12;
			y -= 1;
		} else if(m == 13) {
			m = 1;
			y += 1;
		}

		this.date.setMonth(m - 1);
		this.date.setYear(y);
		this.date.setDate(d);

		this.setData();
	},

	setNextMonth: function() {
		this.setToday(this.year, this.month + 1, this.day);
	},

	setPreMonth: function() {
		this.setToday(this.year, this.month - 1, this.day);
	},

	getFirstWeek: function() {
		this.date.setDate(1);
		var week = this.date.getDay();
		this.date.setDate(this.day);

		return week;
	},

	isLeapYear: function() {
		if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
			return true;
		}
		return false;
	}
};

function Calendar(container, w) {
	this.container = container;
	this.w = w;
	this.today = new Today();
	this.fun = null;
	this.multi = false;

	this.confirm = document.getElementById("confirm");
	this.cancel = document.getElementById("cancel");

	this.caption = document.getElementById("caption");
	this.title = document.getElementById("title");
	this.data = document.getElementById("calendar_data");
	this.cells = document.getElementsByClassName("day_cell");
	this.days = document.getElementsByClassName("day_data");
	this.frontArrow = document.getElementById("left_arrow");
	this.backArrow = document.getElementById("right_arrow");
	this.controller().init();
}

Calendar.prototype.controller = function(){
	var self = this;

	var init = function() {
		
		createTable();

		self.container.onclick = function(e) {
			if(self.multi) {
				multiClick(e.target, 3, 15);
			}else {
				dayClick(e.target, true);				
			}
		};

		self.frontArrow.onclick = function() {
			self.today.setPreMonth();
			createTable();
		};

		self.backArrow.onclick = function() {
			self.today.setNextMonth();
			createTable();
		};
	};

	var setMulti = function(isMulti) {
		self.multi = isMulti;
	};

	var toggleShow = function() {
		if(self.container.className == "show") {
			self.container.className = "hide";
		} else {
			self.container.className = "show";
		}
	};

	var createTable = function() {
		var html = "";
		var dayName = ["日", "一", "二", "三", "四", "五", "六"];
		var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var count = 0, left = 0;
		
		var week = self.today.getFirstWeek();
		
		if(self.today.isLeapYear()) {
			days[1] = 29;
		}
		
		for(var i = 0; i < 7; i++, count++) {
			if(i == 0 || i == 6) {
				html += "<span class='day_cell week_cell special_week'>" + dayName[i] + "</span>";
			} else {
				html += "<span class='day_cell week_cell'>" + dayName[i] + "</span>";
			}
		}
		
		for(var k = week - 1; k >= 0; k--, count++) {
			html += "<span class='day_cell before'>" + (days[self.today.month - 2] - k) + "</span>";
		}

		for(var j = 0; j < days[self.today.month - 1]; j++, count++) {

			if(count % 7 == 0 || count % 7 == 6) {
				if(j + 1 == self.today.day) {
					html += "<span class='day_cell day_data special_week' id='selected_start'>" + (j + 1) + "</span>";
				} else {
					html += "<span class='day_cell day_data special_week'>" + (j + 1) + "</span>";
				}
			} else {
				if(j + 1 == self.today.day) {
					html += "<span class='day_cell day_data' id='selected_start'>" + (j + 1) + "</span>";
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
		var caption = self.today.year + "年" + self.today.month + "月";

		var cell_w = self.w / 7;
		var caption_h = self.w * 0.1;

		self.caption.style.width = self.w + "px";
		self.caption.style.height = caption_h + "px";
		self.title.style.lineHeight = caption_h + "px";
		self.title.style.fontSize = caption_h * 0.5 + "px";
		self.data.style.width = self.w + "px";
		self.data.style.Height = self.w + "px";
		self.data.style.top = caption_h + "px";
		for(var i = 0; i < self.cells.length; i++) {
			self.cells[i].style.width = cell_w + "px";
			self.cells[i].style.height = cell_w + "px";
			self.cells[i].style.lineHeight = cell_w + "px";
			self.cells[i].style.fontSize = caption_h * 0.5 + "px";
		}
		self.title.innerHTML = caption;
	};

	var dayClick = function(ele, isToggle) {
		var oldSelect = document.getElementById("selected_start");

		if(ele.className.indexOf("day_data") != -1) {
			if(ele == oldSelect) {
				ele.id = "";
				return;
			}

			if(oldSelect) {
				oldSelect.id = "";
			}
			ele.id = "selected_start";

			var day = ele.textContent;
			self.today.setToday(null, null, day);
			if(isToggle) {
				toggleShow();
			}
		} else if(ele.className.indexOf("before") != -1) {
			self.frontArrow.click();
		} else if(ele.className.indexOf("after") != -1) {
			self.backArrow.click();
		}

		if(self.fun) {
			self.fun();
		}
	};

	var multiClick = function(ele, minDay, maxDay) {
		if(ele.className.indexOf("before") != -1) {
			self.frontArrow.click();
			return;
		} else if(ele.className.indexOf("after") != -1) {
			self.backArrow.click();
			return;
		} else if(ele.className.indexOf("day_data") != -1) {
			var oldStart = document.getElementById("selected_start");
			var oldEnd = document.getElementById("selected_end");
			var start = oldStart;
			var end = oldEnd;
			var middle = null;
			if(oldEnd) {
				middle = parseInt(oldEnd.textContent) + parseInt(oldStart.textContent);
				middle /= 2;			
			}


			if(oldStart && ele == oldEnd) {
				ele.id = "";
				removeSelect(oldStart, oldEnd);
				return;
			}

			if(oldStart && ele == oldStart) {
				ele.id = "";
				if(end) {
					removeSelect(ele, end);
					end.id = "selected_start";
				}
				return;
			}

			if(parseInt(ele.textContent) < middle) {
				if(start) {
					start.id = "";
				}
				start = ele;
			} else {
				if(end) {
					end.id = "";
				}
				end = ele;
			}

			if(parseInt(start.textContent) > parseInt(oldStart.textContent)) {
				removeSelect(oldStart.previousSibling, start);
			}

			if(oldEnd && parseInt(end.textContent) < parseInt(oldEnd.textContent)) {
				removeSelect(end.previousSibling, oldEnd);
			}


			if(start && end) {
				var range = parseInt(end.textContent) - parseInt(start.textContent) + 1;
				if(range < 0) {
					var temp = start;
					start = end;
					end = temp;
					range = -range;
				}
				if(minDay && range < minDay) {
					start = oldStart;
					end = oldEnd;
					console.log("此范围太小啦！");
				}
				if(maxDay && range > maxDay) {
					start = oldStart;
					end = oldEnd;
					console.log("此范围太大啦！");
				}
				start.id = "selected_start";
				if(end) {
					end.id = "selected_end";
					addSeleted(start, end);				
				}
			}			
		}

		if(self.fun) {
			self.fun();
		}
	};

	var addSeleted = function(start, end) {
		while(start != end.previousSibling) {
			start = start.nextSibling;
			if(start.className.indexOf("selected") == -1) {
				classList = start.className.split(" ");
				classList.push("selected");
				start.className = classList.join(" ");
			}
		}
	};

	var removeSelect = function(start, end) {
		while(start != end.previousSibling) {
			start = start.nextSibling;
			var classList = start.className.split(" ");
			for(var i = 0; i < classList.length; i++) {
				if(classList[i] == "selected") {
					classList.splice(i, 1);
					break;
				}
			}
			start.className = classList.join(" ");
		}
	};


	var findInDays = function(day_num) {
		for(var i = 0; i < self.days.length; i++) {
			if(day_num.toString() == self.days[i].textContent) {
				return self.days[i];
			}
		}
		return false;
	};

	var getDateValue = function() {
		if(self.multi) {
			start = document.getElementById("selected_start");
			end = document.getElementById("selected_end");
			if(start && end) {
				start = parseInt(start.textContent);
				end = parseInt(end.textContent);
				return [self.today.year + "-" + self.today.month + "-" + start,
						self.today.year + "-" + self.today.month + "-" + end];
			}
		} else {
			return self.today.year + "-" + self.today.month + "-" + self.today.day;
		}
	};

	var setDateValue = function(y, m, d, isToggle) {
		self.today.setToday(y, m, d);
		createTable();
		var ele = findInDays(d);
		dayClick(ele, isToggle);
	};

	var setFun = function(fun) {
		if(fun instanceof Function) {
			self.fun = fun;
		} else {
			console.log("回调函数类型错误");
		}
	};

	return {
		init: init,
		toggleShow: toggleShow,
		getDateValue: getDateValue,
		setDateValue: setDateValue,
		setFun: setFun,
		setMulti: setMulti
	};
};