function SortedTable(table) {
	this.table = table;
	this.thHTML = this.table.firstElementChild.children[0].outerHTML;
	this.arrow = null;
	this.reGetData();
	this.init();
}

SortedTable.prototype.findInThs = function(item) {
	for(var i = 0; i < this.ths.length; i++) {
		if(this.ths[i].dataset.type == "number") {
			if(this.ths[i] == item || this.ths[i] == item.parentNode | this.ths[i] == item.parentNode.parentNode) {
				return i;	
			}
		}
	}
	return false;
};

SortedTable.prototype.reGetData = function() {
	this.ths = this.table.firstElementChild.firstElementChild.children;
	this.trs = this.table.firstElementChild.children;
};

SortedTable.prototype.init = function() {
	var self = this;

	this.arrow = self.controller().createEle("div", null, "arrow_wrap");
	var up_arrow = self.controller().createEle("div", null, "up_arrow");
	var down_arrow = self.controller().createEle("div", null, "down_arrow");

	this.arrow.append(up_arrow);
	this.arrow.append(down_arrow);
	var index = null;

	document.onmousemove = function(e) {
		index = self.findInThs(e.target);
		if(index) {
			self.controller().showArrows(self.ths[index], self.arrow);
		} else {
			self.arrow.style.display = "none";
		}
	};

	up_arrow.onclick = function(e) {
		self.controller().sortTable(index ,true);
	};

	down_arrow.onclick = function(e) {
		self.controller().sortTable(index, false);
	};
};

SortedTable.prototype.controller = function() {
	var self = this;
	var showArrows = function(container, arrow) {
		var inHTML = container.innerHTML;
		container.append(arrow);
		arrow.style.display = "block";
		return inHTML;
	};

	var createEle = function(tagName, inHTML, classN) {
		var temp = document.createElement(tagName);
		if(inHTML) {
			temp.innerHTML = inHTML;
		}
		if(classN) {
			temp.className = classN;
		}
		return temp;
	};

	var sortTable = function(index, sortUp) {
		var oldList = [];
		var sortList = [];
		var trHTML = [];
		trHTML[0] = self.thHTML;
		for(var i = 1; i < self.trs.length; i++) {
			trHTML.push(self.trs[i].outerHTML);
			oldList.push(self.trs[i].children[index].innerText);
			sortList.push(self.trs[i].children[index].innerText);
		}
		sortList.sort(function(a, b) {
			if(sortUp) {
				return a - b;
			} else {
				return b - a;
			}
		});
		trHTML = sortTr(oldList, sortList, trHTML);
		self.table.firstElementChild.innerHTML = trHTML.join("");
		self.reGetData();
		showArrows(self.ths[index], self.arrow);
	};

	var sortTr = function(oldList, newList, trHTML) {
		var temp, temp1;
		var orderHTML = [];
		orderHTML[0] = trHTML[0];
		for(var i = 0; i < oldList.length; i++) {
			for(var j = 0; j < newList.length; j++) {
				if(oldList[i] == newList[j]) {
					orderHTML[j + 1] = trHTML[i + 1];
					newList[j] = null;
					break;
				}
			}
		}
		return orderHTML;
	};


	return {
		showArrows: showArrows,
		createEle: createEle,
		sortTable: sortTable
	};
};

