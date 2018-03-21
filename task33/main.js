(function(){

	var ITEM_ROW = 10;
	var ITEM_COL = 10;

	function ItemActive(div, x, y) {
		this.posX = x;
		this.posY = y;
		this.deg = 0;
		this.cmdBox = null;
		this.ele = div;
		this.ele.id = "active_item";
	}

	ItemActive.prototype.controller = function() {
		var self = this;
		var subLinearMove = function(newX, newY) {
			var index = newX * ITEM_COL	+ newY;
			self.ele.id = "";
			self.ele.style = null;
			self.ele = self.items[index];
			self.ele.id = "active_item";
			rotateBox();				
		};
		var linearMove = function() {
			if(self.deg == 0) {
				if(self.posX > 0) {
					subLinearMove(--self.posX, self.posY);					
				}
			} else if(self.deg == 90) {
				if(self.posY < 9) {
					subLinearMove(self.posX, ++self.posY);					
				}
			} else if(self.deg == 180) {
				if(self.posX < 9) {
					subLinearMove(++self.posX, self.posY);					
				}
			} else if(self.deg == 270) {
				if(self.posY > 0) {
					subLinearMove(self.posX, --self.posY);					
				}
			}
		};
		var rotate = function(cmd) {
			if(cmd.indexOf("LEF") != -1) {
				self.deg += 270;
			} else if(cmd.indexOf("RIG") != -1) {
				self.deg += 90;
			} else if(cmd.indexOf("BAC") != -1) {
				self.deg += 180;
			}
			self.deg = self.deg % 360;
			rotateBox();
		};
		var rotateBox = function() {
			self.ele.style.transform = "rotate(" + self.deg + "deg)";
		};
		return {
			rotate: rotate,
			linearMove: linearMove
		};
	};

	ItemActive.prototype.msgController = function() {
		var self = this;
		var setCmdBox = function(box) {
			self.cmdBox = box;
		};
		var executeCmd = function() {
			var cmd = self.cmdBox.value.toUpperCase();
			if(cmd != "") {
				if(cmd.indexOf("TUN") != -1) {
					self.controller().rotate(cmd);
				} else if(cmd == "GO"){
					self.controller().linearMove();
				}				
			}
		};
		return {
			setCmdBox: setCmdBox,
			executeCmd: executeCmd
		};
	};

	function createGrid(container, row, col) {
		var html = "";
		for(var i = 0; i < row; i++) {
			for(var j = 0; j < col; j++) {
				if(j == 9 && i == 9) {
					html += "<div class='item item-bottom item-right'></div>";
				} else if(i == 9) {
					html += "<div class='item item-bottom'></div>";
				} else if(j == 9) {
					html += "<div class='item item-right'></div>";						
				} else {
					html += "<div class='item'></div>";
				}
			}
		}
		container.innerHTML = html;
	}

	window.onload = function(){
		var container = document.getElementById("container");
		createGrid(container, ITEM_ROW, ITEM_COL);

		var btn = document.getElementById("exe_btn");
		var items = document.getElementsByClassName("item");
		var inputBox = document.getElementById("exe_cmd");

		var randomX = Math.floor(Math.random() * 10 + 0);
		var randomY = Math.floor(Math.random() * 10 + 0);
		var index = randomX * ITEM_COL + randomY;
		itemActive = new ItemActive(items[index], randomX, randomY);
		ItemActive.prototype.items = items;

		itemActive.msgController().setCmdBox(inputBox);
		btn.onclick = function() {
			itemActive.msgController().executeCmd();
		};
	};

})();
