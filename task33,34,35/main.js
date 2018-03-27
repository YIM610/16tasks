(function(){

	var ITEM_ROW = 10;
	var ITEM_COL = 10;
	var ROW_WIDTH = 50;
	var COL_WIDTH = 50;

	function ItemActive(div, x, y) {
		this.posX = x;
		this.posY = y;
		this.deg = 0;
		this.realDeg = 0;
		this.cmdBox = null;
		this.ele = div;
		this.controller().showEle();
	}

	ItemActive.prototype.controller = function() {
		var self = this;
		var showEle = function() {
			self.ele.style.top = self.posX * COL_WIDTH + "px";
			self.ele.style.left = self.posY * ROW_WIDTH + "px";
		};
		var subLinearMove = function(newX, newY) {
			self.posX = newX;
			self.posY = newY;
			showEle();				
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
			if(cmd == "TUN LEF") {
				self.deg += 270;
				self.realDeg -= 90;
			} else if(cmd == "TUN RIG") {
				self.deg += 90;
				self.realDeg += 90;
			} else if(cmd == "TUN BAC") {
				self.deg += 180;
				self.realDeg += 180;
			}
			self.deg = self.deg % 360;
			rotateBox();
		};
		var rotateBox = function() {
			self.ele.style.transform = "rotate(" + self.realDeg + "deg)";
		};
		var transform = function(cmd) {
			if(cmd == "TRA LEF") {
				if(self.posY > 0) {
					subLinearMove(self.posX, --self.posY);					
				}
			} else if(cmd == "TRA TOP") {
				if(self.posX > 0) {
					subLinearMove(--self.posX, self.posY);					
				}
			} else if(cmd == "TRA RIG") {
				if(self.posY < 9) {
					subLinearMove(self.posX, ++self.posY);					
				}
			} else if(cmd == "TRA BOT") {
				if(self.posX < 9) {
					subLinearMove(++self.posX, self.posY);					
				}
			}
		};
		var move = function(cmd) {
			if(cmd == "MOV LEF") {
				self.deg = 270;
				self.realDeg = -90;
			} else if(cmd == "MOV RIG") {
				self.deg = 90;
				self.realDeg = 90;
			} else if(cmd == "MOV TOP") {
				self.deg = 0;
				self.realDeg = 0;
			} else if(cmd == "MOV BOT") {
				self.deg = 180;
				self.realDeg = 180;
			}			rotateBox();
			linearMove();
		};
		return {
			rotate: rotate,
			linearMove: linearMove,
			showEle: showEle,
			transform: transform,
			move: move
		};
	};

	ItemActive.prototype.msgController = function() {
		var self = this;
		var setCmdBox = function(box) {
			self.cmdBox = box;
		};
		var executeCmd = function(cmd) {
			if(cmd != "") {
				if(cmd == "GO"){
					self.controller().linearMove();
				} else if(cmd.indexOf("TUN") != -1) {
					self.controller().rotate(cmd);
				} else 	if(cmd.indexOf("TRA") != -1) {
					self.controller().transform(cmd);
				} else if(cmd.indexOf("MOV") != -1) {
					self.controller().move(cmd);
				}
			}
		};
		return {
			setCmdBox: setCmdBox,
			executeCmd: executeCmd
		};
	};

	function Input(textArea, numberBar, item) {
		this.flag = 1;
		this.textArea = textArea;
		this.numberBar = numberBar;
		this.item = item;
		this.count = 1;
		this.oldLen = null;
		this.exeList = [["GO", 
						"TRA LEF", "TRA TOP", "TRA RIG", "TRA BOT",
						"MOV LEF", "MOV TOP", "MOV RIG", "MOV BOT"],
						"TUN LEF", "TUN RIG", "TUN BAC"
						];
	}

	Input.prototype.init = function() {
		var self = this;
		var x = 0;
		self.numberBar.scrollTop = 0;
		self.textArea.onkeyup = function(e) {
			if(e.keyCode == 13) {
				self.count++;
				var html = self.numberBar.innerHTML;
				html += '<span class=""">' + self.count + '</span>';
				self.numberBar.innerHTML = html;
				self.oldLen = self.textArea.value.split("\n").length;
			} else if(e.keyCode == 8 && self.oldLen != null && self.textArea.value.split("\n").length != self.oldLen) {
				self.count--;
				self.numberBar.removeChild(self.numberBar.lastChild);
				self.oldLen = self.textArea.value.split("\n").length;
			}
			self.numberBar.scrollTop = self.textArea.scrollTop;
		};
		self.textArea.onscroll = function() {	
			self.numberBar.scrollTop = self.textArea.scrollTop;
		};
		self.textArea.onfocus = function() {
			if(self.flag == 1) {
				self.numberBar.innerHTML = "<span class=''>1</span>";
				self.flag = 0;
			}
		};
		self.textArea.onblur = function() {
			if(self.textArea.value == "") {
				self.numberBar.innerHTML = "";
				self.flag = 1;
			}
		};
	};

	Input.prototype.controller = function() {
		var self = this;
		var timer = null;
		function executeAll() {
			var i = 0;
			var cmd = self.textArea.value.toUpperCase();
			var cmdList = cmd.split("\n");
			if(validate(cmdList)) {
				self.item.msgController().executeCmd(cmdList[0]);
				i++;
				timer = setInterval(function() {
					if(i < cmdList.length) {
						self.item.msgController().executeCmd(cmdList[i]);
						i++;						
					} else {
						clearInterval(timer);
					}
				}, 1000);
			}
		}
		function validate(list) {
			var len = list.length;
			var flag = 1;
			for(var i = 0, index = 0; i < len;i++, index++) {
				if(list[i] == "") {
					list.splice(i, 1);
					len--;
				} else {
					patt = /^([A-Z]+(?:\s[A-Z]+)*)\s(\d+)$/;
					var matches = patt.exec(list[i]);
					if(self.numberBar.childNodes[index].className == "input_wrong") {
						self.numberBar.childNodes[index].className = "";
					}
					if(matches) {
						if(matches[1] && (self.exeList[0].indexOf(matches[1]) != -1)) {
							var num = parseInt(matches[2]) - 1;
							for(var j = 0; j < num; j++) {
								list.splice(i + 1, 0, matches[1]);
							}
							list[i] = matches[1];
							i += num;
							len += num;
						}
					}
					if(self.exeList.indexOf(list[i]) == -1 && self.exeList[0].indexOf(list[i]) == -1) {
						self.numberBar.childNodes[index].className = "input_wrong";
						flag = 0;
					}
				}
			}
			if(flag == 0 || list.length == 0) {
				return false;
			}
			return true;
		}

		return {
			executeAll: executeAll
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
		html += "<div id='active_item'></div>";
		container.innerHTML = html;
	}

	window.onload = function(){
		var container = document.getElementById("container");
		createGrid(container, ITEM_ROW, ITEM_COL);

		var btn = document.getElementById("exe_btn");
		var inputBox = document.getElementById("exe_cmd");
		var numberBox = document.getElementById("line_num");

		var activeItem = document.getElementById("active_item");
		var randomX = Math.floor(Math.random() * 10 + 0);
		var randomY = Math.floor(Math.random() * 10 + 0);
		itemActive = new ItemActive(activeItem, randomX, randomY);
		//itemActive.controller().showEle();

		var inputArea = new Input(inputBox, numberBox, itemActive);
		inputArea.init();
		inputBox.focus();
		itemActive.msgController().setCmdBox(inputBox);

		btn.onclick = function() {
			inputArea.controller().executeAll();
		};
	};

})();
