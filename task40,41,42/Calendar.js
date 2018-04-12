function Today() {
	this.date = new Date();
	this.now = new Date();

	this.nowYear = this.now.getFullYear();
	this.nowMonth = this.now.getMonth() + 1;
	this.nowDay = this.now.getDate();

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
		this.setToday(this.year, this.month + 1, 1);
		if(this.isNow() != null) {
			this.setToday(null, null, this.nowDay);
		}
	},

	setPreMonth: function() {
		this.setToday(this.year, this.month - 1, 1);
		if(this.isNow() != null) {
			this.setToday(null, null, this.nowDay);
		}
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
	},

	isNow: function() {
		if(this.nowYear == this.year && this.nowMonth == this.month) {
			return this.nowDay;
		}
		return;
	},

	isOld: function() {
		if(this.year < this.nowYear || (this.year == this.nowYear && this.month < this.nowMonth)) {
			return true;
		}
		return false;
	}
};

function Day(ele, y, m, d) {
	this.ele = ele;
	this.year = parseInt(y);
	this.month = parseInt(m);
	this.day = parseInt(d);
}

Day.prototype.set = function(y, m, d) {
	if(y) {
		this.year = parseInt(y);
	}

	if(m) {
		this.month = parseInt(m);
	}

	if(d) {
		this.day = parseInt(d);
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

	this.start = null;
	this.end = null;
	this.choose = null;

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
		var selected = document.getElementById("selected_start");
		if(selected) {
			setStart(selected);
		}

		self.container.onclick = function(e) {
			if(self.multi) {
				multiClick(e.target, 10, 100);
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
		var lastMonthIndex = self.today.month - 2;

		var toChoose = false;
		if(self.today.isNow() != null) {
			toChoose = true;
		}

		var toAvail = true;
		if(self.today.isOld()) {
			toAvail = false;
		}

		if(lastMonthIndex < 0) {
			lastMonthIndex += 12;
		}
		
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
			html += "<span class='day_cell not_avail before'>" + (days[lastMonthIndex] - k) + "</span>";
		}

		if(self.today.isOld) {
			for(var j = 0; j < days[self.today.month - 1]; j++, count++) {
				if(toAvail) {
					if(j + 1 < self.today.day) {
						html += "<span class='day_cell day_data not_avail'>" + (j + 1) + "</span>";
					} else if(toChoose && j + 1 == self.today.day) {
						html += "<span class='day_cell day_data' id='selected_start'>" + (j + 1) + "</span>";
					} else {
						html += "<span class='day_cell day_data'>" + (j + 1) + "</span>";			
					}					
				} else {
					if(toChoose && j + 1 == self.today.day) {
						html += "<span class='day_cell day_data not_avail' id='selected_start'>" + (j + 1) + "</span>";
					} else {
						html += "<span class='day_cell day_data not_avail'>" + (j + 1) + "</span>";			
					}
				}
			}
		} else {
			for(var j = 0; j < days[self.today.month - 1]; j++, count++) {
				if(count % 7 == 0 || count % 7 == 6) {
					if(toChoose && j + 1 == self.today.day) {
						html += "<span class='day_cell day_data special_week' id='selected_start'>" + (j + 1) + "</span>";
					} else {
						html += "<span class='day_cell day_data special_week'>" + (j + 1) + "</span>";
					}
				} else {
					if(toChoose && j + 1 == self.today.day) {
						html += "<span class='day_cell day_data' id='selected_start'>" + (j + 1) + "</span>";
					} else {
						html += "<span class='day_cell day_data'>" + (j + 1) + "</span>";			
					}
				}
			}		
		}


		if(count % 7 != 0) {
			left = 7 - (count % 7);
		}

		for(var l = 0; l < left; l++) {
			html += "<span class='day_cell after not_now'>" + (l + 1) + "</span>";
		}

		self.data.innerHTML = html;
		setTable();

		tableInit();
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

	var tableInit = function() {
		var start, end;
		var len = self.days.length;
		if(self.start && self.end) {
			if(self.start.year == self.today.year && self.start.month == self.today.month
				&& (self.end.year != self.today.year || self.end.month != self.today.month)) {
				//起点在当前页，终点不在当前页

				end = self.days[len - 1];
				addSeleted(null, end);
			} else if((self.start.year != self.today.year || self.start.month != self.today.month)
				 && self.end.year == self.today.year && self.end.month == self.today.month) {
				//起点不在当前页，终点在当前页

				start = self.days[0];
				addSeleted(start, null);				
			} else if((self.start.year != self.today.year || self.start.month != self.today.month)
				&& (self.end.year != self.today.year || self.end.month != self.today.month)
				&& (self.today.year + self.today.month < self.end.year + self.end.month)
				&& (self.today.year + self.today.month > self.start.year + self.start.month)){
				//起点终点都不在当前页，且当前页位于区间中

				start = self.days[0];
				end = self.days[len - 1];
				addSeleted(start, end);
			} else if(self.start.year == self.today.year && self.start.month == self.today.month
				&& self.end.year == self.today.year && self.end.month == self.today.month) {
				//起点终点都在当前页

				start = self.days[self.start.day - 1];
				end = self.days[self.end.day - 1];
				setStart(start);
				setEnd(end);
				addSeleted(start, end);
			}
		} else if(self.start && !self.end
		 && self.start.year == self.today.year && self.start.month == self.today.month) {
			start = self.days[self.start.day - 1];
			setStart(start);
		}

		var selected_start = document.getElementById("selected_start");
		var selected_end = document.getElementById("selected_end");
		if(selected_start) {
			setStart(selected_start);
		}

		if(selected_end) {
			setEnd(selected_end);
		}
	};

	var dayClick = function(ele, isToggle) {
		var oldSelect = document.getElementById("selected_start");

		if(ele.className.indexOf("day_data") != -1) {
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
		} else if(ele.className.indexOf("not_avail") != -1) {
			alert("日期不在可选范围之内!");
		} else if(ele.className.indexOf("day_data") != -1) {
			removeSelect();

			if(self.start && ele == self.start.ele) {
				removeSelect();
				removeStart();
				if(self.end) {
					var newStart = self.end;
					removeEnd();						
					setStart(newStart);
				}
				return;
			}

			if(self.end && ele == self.end.ele) {
				removeSelect();
				removeEnd();
				return;
			}

			if(self.start) {
				setEnd(ele);
			} else {
				setStart(ele);
				return;
			}

			if(rangeIsAvail(minDay, maxDay)) {
				addSeleted();
				if(self.fun) {
					self.fun();
				}
			} else {
				removeEnd();
				alert("请按规定选择" + minDay + "~" + maxDay + "天");
			}
		}		
	};

	var rangeIsAvail = function(minNum, maxNum) {
		var start = self.start;
		var end = self.end;
		var num = 0;
		var y = start.year;
		var yEnd = end.year;
		var m = start.month;
		var mEnd = end.month;
		var sDay = start.day;
		var eDay = end.day;
		var flag = true;

		var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		while(!(y == yEnd && m == mEnd)) {
			if((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
				days[1] = 29;
			} else {
				days[1] = 28;
			}
			if(flag) {
				num += days[m - 1] - sDay + 1;
				flag = false;
			} else {
				num += days[m - 1];
			}
			m += 1;
			if(m == 13) {
				y += 1;
				m = 1;
			}
		}
		if(flag) {
			num += eDay - sDay + 1;
		} else {
			num += eDay;
		}

		if(num < minNum || num > maxNum) {
			return false;
		} else {
			return true;
		}
	};

	var setStart = function(ele) {
		if(ele instanceof Day) {
			self.start = new Day(ele.ele, ele.year, ele.month, ele.day);
		} else if(self.start) {
			self.start.ele.id = "";
			self.start.ele = ele;
		} else {
			var captionText = self.title.textContent;
			var patt = /(\d{4})年(\d+)月/;
			var matches = patt.exec(captionText);
			var day = ele.textContent;
			self.start = new Day(ele, matches[1], matches[2], day);
		}
		self.start.ele.id = "selected_start";
	};

	var removeStart = function() {
		if(self.start) {
			self.start.ele.id = "";
			self.start = null;
		}
	};

	var removeEnd = function() {
		if(self.end) {
			self.end.ele.id = "";
			self.end = null;
		}
	};

	var setEnd = function(ele) {
		var captionText = self.title.textContent;
		var patt = /(\d{4})年(\d+)月/;
		var matches = patt.exec(captionText);
		var day = ele.textContent;

		if(self.end) {
			self.end.ele.id = "";			
		} else {
			self.end = new Day(ele, matches[1], matches[2], day);
		}

		self.end.ele = ele;
		self.end.set(matches[1], matches[2], day);
		self.end.ele.id = "selected_end";
	};

	var addSeleted = function(start, end) {
		var newStart = document.getElementById("selected_start");
		var classList = [];
		if(newStart) {
			start = newStart;
		} else {
			start = self.days[0];
		}
		if(!start) {
			start = self.start.ele;
		}
		if(!end) {
			end = self.end.ele;			
		}

		while(start != end) {
			if(start.className.indexOf("selected") == -1) {
				classList = start.className.split(" ");
				classList.push("selected");
				start.className = classList.join(" ");
			}

			start = start.nextSibling;
		}

		if(end.className.indexOf("selected") == -1) {
			classList = end.className.split(" ");
			classList.push("selected");
			end.className = classList.join(" ");
		}
	};

	var removeSelect = function() {
		var start, end;
		var classList = [];

		if(self.start) {
			start = self.start.ele;
		}
		if(self.end) {
			end = self.end.ele;			
		}

		var selected_start = document.getElementById("selected_start");
		var selected_end = document.getElementById("selected_end");

		if(!selected_start && !selected_end) {
			return;
		}

		if(selected_start && !selected_end && self.end) {
			var len = self.days.length;
			end = self.days[len - 1];
		}

		if(!selected_start && selected_end && self.start) {
			start = self.days[0];
		}

		if(start && end) {
			while(start != end) {
				classList = start.className.split(" ");
				for(var i = 0; i < classList.length; i++) {
					if(classList[i] == "selected") {
						classList.splice(i, 1);
						break;
					}
				}
				start.className = classList.join(" ");
				start = start.nextSibling;
			}
			classList = end.className.split(" ");
			for(var j = 0; j < classList.length; j++) {
				if(classList[j] == "selected") {
					classList.splice(j, 1);
					break;
				}
			}
			end.className = classList.join(" ");

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
			if(self.start && self.end) {
				return [self.start.year + "-" + self.start.month + "-" + self.start.day,
						self.end.year + "-" + self.end.month + "-" + self.end.day];
			} else {
				return "";
			}
		} else {
			return self.today.year + "-" + self.today.month + "-" + self.today.day;
		}
	};

	var setDateValue = function(start, isToggle, end) {
		self.today.setToday(start[0], start[1], start[2]);
		createTable();
		var eleStart = findInDays(start[2]);	
		dayClick(eleStart, isToggle);


		if(end && self.multi) {
			var eleEnd = findInDays(end[2]);
			multiClick(eleEnd, 3, 15);
		}
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