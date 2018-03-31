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
		this.path = [];
		this.items = document.getElementsByClassName("item");
		this.controller().showEle();
	}

	ItemActive.prototype.isAvail = function(x, y) {
		if(x >= 0 && x < ITEM_ROW && y >= 0 && y < ITEM_COL && this.items[x * ITEM_COL + y].dataset.type != "wall") {
			return true;
		}
		return false;
	};

	ItemActive.prototype.pathControl = function(x, y) {
		var self = this;
		var from = [self.posX, self.posY];
		var to = [x, y];
		var AStar = function() {
			var closedSet = [];
			var nodePath = [];
			var visitedList = [];
			var openSet = [{pos: from, f: computeF(from), g:computeG(from), parent: null}];
			var n = null;
			do {
				n = openSet.pop();
				closedSet.push(n);
				var children = getSurround(n);
				for(var i in children) {
					var item = children[i];
					var index = getIndex(item, openSet);
					if(self.isAvail(item.pos[0], item.pos[1]) && getIndex(item, closedSet) != -1) {
						var g = n.g + 1;
						if(index == -1) {
							item.g = g;
							item.f = computeF(item.pos, item.g);
							item.parent = n;
							openSet.push(item);
							visitedList.push(item);
						} else {
							if(g < openSet[index].g) {
								openSet[index].parent = n;
								openSet[index].f = computeF(item, g);
							}
						}
					}
				}
				if(openSet.length == 0) {
					console.log("目标不可达");
					return;
				}
				openSet.sort(function(a, b) {
					return b.f - a.f;
				});
			}while(!(n.pos[0] == to[0] && n.pos[1] == to[1]));

			if(n.pos[0] == to[0] && n.pos[1] == to[1]) {
				while(!(n.pos[0] == from[0] && n.pos[1] == from[1])) {
					nodePath.unshift(n.pos);
					n = n.parent;					
				}
				return nodePath;
			}


			function getIndex(node, list) {
				for(var i in list) {
					if(node.pos[0] == list[i].pos[0] && node.pos[1] == list[i].pos[1]) {
						return i;
					}
				}
				return -1;
			}
			function getSurround(node) {
				return [{pos:[node.pos[0] - 1, node.pos[1]]},
						{pos:[node.pos[0] + 1, node.pos[1]]},
						{pos:[node.pos[0], node.pos[1] - 1]},
						{pos:[node.pos[0], node.pos[1] + 1]}
						];
			}
			function computeF(n, g) {
				var h = Math.abs(to[0] - n[0]) + Math.abs(to[1] - n[1]);
				if(g) {
					return g + h;
				}
				var newg  = Math.abs(from[0] - n[0]) + Math.abs(from[1] - n[1]);
				return newg + h;
			}
			function computeG(n) {
				return Math.abs(from[0] - n[0]) + Math.abs(from[1] - n[1]);
			}
			function addNode(list, node) {
				if(list.indexOf(node) != -1) {
					return;
				}
				if(list.length == 0) {
					list[0] = node;
					return;
				}
				for(var i = list.length; i > 0; i--) {
					if(node.f > list[i - 1].f) {
						list[i] = list[i - 1];
					} else {
						list[i] = node;
						break;
					}
				}
			}
		};
		return {
			AStar: AStar
		};
	};

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
			var newX = null;
			var newY = null;
			if(self.deg == 0) {
				newX = self.posX - 1;
				newY = self.posY;
			} else if(self.deg == 90) {
				newX = self.posX;
				newY = self.posY + 1;
			} else if(self.deg == 180) {
				newX = self.posX + 1;
				newY = self.posY;
			} else if(self.deg == 270) {
				newX = self.posX;
				newY = self.posY - 1;
			}

			if(self.isAvail(newX, newY)) {
				subLinearMove(newX, newY);				
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
				if(self.realDeg < 0) {
					self.realDeg -= 180;
				} else {
					self.realDeg += 180;					
				}
			}
			self.deg = self.deg % 360;
			rotateBox();
		};
		var rotateBox = function() {
			self.ele.style.transform = "rotate(" + self.realDeg + "deg)";
		};
		var transform = function(cmd) {
			var newX = null;
			var newY = null;
			if(cmd == "TRA LEF") {
				newX = self.posX;
				newY = self.posY - 1;
			} else if(cmd == "TRA TOP") {
				newX = self.posX - 1;
				newY = self.posY;
			} else if(cmd == "TRA RIG") {
				newX = self.posX;
				newY = self.posY + 1;
			} else if(cmd == "TRA BOT") {
				newX = self.posX + 1;
				newY = self.posY;
			}
			if(self.isAvail(newX, newY)) {
				subLinearMove(newX, newY);										
			}
		};
		var move = function(cmd) {
			if(cmd == "MOV LEF") {
				if(self.deg != 270) {
					if(self.deg == 0) {
						self.realDeg -= 90;
					} else if(self.deg == 90) {
						self.realDeg -= 180;
					} else if(self.deg == 180) {
						self.realDeg += 90;
					}
					self.deg = 270;
				}
			} else if(cmd == "MOV RIG") {
				if(self.deg != 90) {
					if(self.deg == 0) {
						self.realDeg += 90;
					} else if(self.deg == 270) {
						self.realDeg += 180;
					} else if(self.deg == 180) {
						self.realDeg -= 90;
					}
					self.deg = 90;
				}
			} else if(cmd == "MOV TOP") {
				if(self.deg != 0) {
					if(self.deg == 90) {
						self.realDeg -= 90;
					} else if(self.deg == 180) {
						self.realDeg -= 180;
					} else if(self.deg == 270){
						self.realDeg += 90;
					}
					self.deg = 0;
				}
			} else if(cmd == "MOV BOT") {
				if(self.deg != 180) {
					if(self.deg == 270) {
						self.realDeg -= 90;
					}else if(self.deg == 0) {
						self.realDeg += 180;
					}else if(self.deg == 90) {
						self.realDeg += 90;
					}
					self.deg = 180;					
				}
			}			
			rotateBox();
			linearMove();
		};
		var build = function() {
			var newX = null;
			var newY = null;
			if(self.deg == 0) {
				newX = self.posX - 1;
				newY = self.posY;
			} else if(self.deg == 90) {
				newX = self.posX;
				newY = self.posY + 1;
			} else if(self.deg == 180) {
				newX = self.posX + 1;
				newY = self.posY;
			} else if(self.deg == 270) {
				newX = self.posX;
				newY = self.posY - 1;
			}
			if(self.isAvail(newX, newY)) {
				subBuild(newX, newY);				
			} else {
				console.log("此处不可修墙");
			}
		};
		var subBuild = function(posX, posY) {
			var item = self.items[posX * ITEM_COL + posY];
			if(item.dataset.type == "wall") {
				item.dataset.type = null;
			} else {
				item.dataset.type = "wall";
			}
		};
		var gotoPos = function(cmd) {
			var matches = /^GO\s+TO\s+(\d+),(\d+)$/.exec(cmd);
			if(matches) {
				var posX = parseInt(matches[1]);
				var posY = parseInt(matches[2]);
				var pos = [posX, posY];
				subGotoPos(pos);				
			}
		};
		var subGotoPos = function(pos) {
			if(pos[0] < self.posX) {
				move("MOV TOP");
			} else if(pos[0] > self.posX) {
				move("MOV BOT");
			}
			if(pos[1] < self.posY) {
				move("MOV LEF");
			} else if(pos[1] > self.posY) {
				move("MOV RIG");
			}
		};
		var bru = function(cmd) {
			var newX = null;
			var newY = null;
			var matches = /^BRU\s([0-9A-F]{6}$)/.exec(cmd);
			if(self.deg == 0) {
				newX = self.posX - 1;
				newY = self.posY;
			} else if(self.deg == 90) {
				newX = self.posX;
				newY = self.posY + 1;
			} else if(self.deg == 180) {
				newX = self.posX + 1;
				newY = self.posY;
			} else if(self.deg == 270) {
				newX = self.posX;
				newY = self.posY - 1;
			}
			if(self.items[newX * ITEM_COL + newY] && self.items[newX * ITEM_COL + newY].dataset.type == "wall") {
				self.items[newX * ITEM_COL + newY].style.backgroundColor = "#" + matches[1];				
			} else {
				console.log("此处不存在墙可以粉刷");
			}
		}
		return {
			rotate: rotate,
			linearMove: linearMove,
			showEle: showEle,
			transform: transform,
			move: move,
			build: build,
			subBuild: subBuild,
			gotoPos: gotoPos,
			bru: bru
		};
	};

	ItemActive.prototype.msgController = function() {
		var self = this;
		var setCmdBox = function(box) {
			self.cmdBox = box;
		};
		var executeCmd = function(cmd) {
			if(cmd != "") {
				self.running = true;
				if(cmd == "GO"){
					self.controller().linearMove();
				} else if(cmd.indexOf("TUN") != -1) {
					self.controller().rotate(cmd);
				} else 	if(cmd.indexOf("TRA") != -1) {
					self.controller().transform(cmd);
				} else if(cmd.indexOf("MOV") != -1) {
					self.controller().move(cmd);
				} else if(cmd == "BUILD") {
					self.controller().build();
				} else if(cmd.indexOf("GO TO") != -1) {
					self.controller().gotoPos(cmd);
				} else if(cmd.indexOf("BRU") != -1) {
					self.controller().bru(cmd);
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
						"MOV LEF", "MOV TOP", "MOV RIG", "MOV BOT", "GO TO"],
						"TUN LEF", "TUN RIG", "TUN BAC",
						"BUILD", "GO", "BRU"
						];
	}

	Input.prototype.init = function() {
		var self = this;
		self.textArea.oninput = function() {
			var len = self.textArea.value.split("\n").length;
			if(len != self.oldLen) {
				update(len);
			}
		};
		self.textArea.onscroll = function() {
			self.numberBar.style.top = -self.textArea.scrollTop + "px";
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
		function update(length) {
			var html = "";
			for(var i = 0; i < length; i++) {
				var j = i + 1;
				html += "<span>" + j + "</span>";
			}
			self.numberBar.innerHTML = html;
			self.oldLen = length;
		}
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
				}, 500);
			}
		}
		function setWrong(index, flag) {
			self.numberBar.childNodes[index].className = "input_wrong";
			return 1;
		}
		function validate(list) {
			var len = list.length;
			var flag = 0;
			for(var i = 0, index = 0; i < len;i++, index++) {
				if(list[i] == "") {
					list.splice(i, 1);
					len--;
				} else {
					patt = /^(([A-Z]+)(?:\s(?:([A-Z]+)|([0-9A-F]{6})))*)(?:\s(?:(\d+)|(\d+),(\d+)))?$/;
					var matches = patt.exec(list[i]);
					if(self.numberBar.childNodes[index].className == "input_wrong") {
						self.numberBar.childNodes[index].className = "";
					}
					if(matches) {
						if(matches[0] && self.exeList.indexOf(matches[0]) != -1) {
							continue;
						}

						if(matches[1] && self.exeList[0].indexOf(matches[1]) != -1) {
							if(matches[5]) {
								var num = parseInt(matches[5]) - 1;
								for(var j = 0; j < num; j++) {
									list.splice(i + 1, 0, matches[1]);
								}
								list[i] = matches[1];
								i += num;
								len += num;
							} else if(matches[6] && matches[7] && !(matches[6] < 0 || matches[6] > ITEM_ROW - 1 || matches[7] < 0 || matches[7] > ITEM_COL - 1)) {
								var posX = parseInt(matches[6]);
								var posY = parseInt(matches[7]);
								newList = self.item.pathControl(matches[6], matches[7]).AStar();
								
								if(newList) {
									for(var k = newList.length - 2; k >= 0; k--) {
										list.splice(i, 0, "GO TO " + newList[k][0] + "," + newList[k][1]);
									}
									i += newList.length - 1;
									len +=newList.length - 1;
								} else {
									list.splice(i, 1);
								}
							}
						} else if(!matches[2] || self.exeList.indexOf(matches[2]) == -1 || !matches[4]){
							flag = setWrong(index);
							continue;
						}
					} else {
						flag = setWrong(index);
					}
				}
			}
			if(flag == 1 || list.length == 0) {
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
		var buildBtn = document.getElementById("build_btn");
		var inputBox = document.getElementById("exe_cmd");
		var numberBox = document.getElementById("line_num");

		var activeItem = document.getElementById("active_item");
		var randomX = Math.floor(Math.random() * ITEM_ROW + 0);
		var randomY = Math.floor(Math.random() * ITEM_COL + 0);
		itemActive = new ItemActive(activeItem, randomX, randomY);

		var inputArea = new Input(inputBox, numberBox, itemActive);
		inputArea.init();
		itemActive.msgController().setCmdBox(inputBox);

		btn.onclick = function() {
			inputArea.controller().executeAll();
		};
		buildBtn.onclick = function() {

			var random = Math.floor(Math.random() * ITEM_COL + 0);
			for(var i = 0; i < random; i++) {
				var randomX = Math.floor(Math.random() * ITEM_ROW + 0);
				var randomY = Math.floor(Math.random() * ITEM_COL + 0);if(itemActive.isAvail(randomX, randomY)) {
					itemActive.controller().subBuild(randomX, randomY);				
				}				
			}
		};
		document.onkeydown = function(e) {
			if(e.target.tagName == "BODY") {
				var obj = {37: "MOV LEF", 38: "MOV TOP", 39: "MOV RIG", 40: "MOV BOT", 32: "BUILD"};
				var cmd = obj[e.keyCode];
				if(cmd != null) {
					e.preventDefault();
					itemActive.msgController().executeCmd(cmd);
				}
			}
		};
	};

})();
