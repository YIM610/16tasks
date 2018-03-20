(function() {
	var SPACESHIP_COUNT = 4;
	var SPACESHIP_WIDTH = 40;
	var SPACESHIP_HEIGHT = 40;
	var LOW_SPACESHIP_SPEED = 30;
	var MEDIUM_SPACESHIP_SPEED = 50;
	var HIGN_SPACESHIP_SPEED = 80;

	var SCREEN_WIDTH = 600;
	var SCREEN_HEIGHT = 600;
	var SCREEN_CENTER_X = SCREEN_WIDTH / 2;
	var SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;
	
	var PLANET_RADIUS = 50;
	var ORBIT_COUNT = 4;

	var SMALL_CHARGE_RATE = 0.04;
	var MEDIUM_CHARGE_RATE = 0.06;
	var STRONG_CHARGE_RATE = 0.08;
	var SMALL_DISCHARGE_RATE = 0.1;
	var MEDIUM_DISCHARGE_RATE = 0.14;
	var STRONG_DISCHARGE_RATE = 0.18;
	var POWERBAR_COLOR_GOOD = "#9BCD9B";
	var POWERBAR_COLOR_MEDIUM = "#FFF68F";
	var POWERBAR_COLOR_BAD = "#FF3030";
	var POWERBAR_WIDTH = 5;
	var POWERBAR_POS_OFSET = 5;

	var FAILURE_RATE = 0.1;

	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var Spaceship = function(id, dySys, speed, powerSys) {
		this.id = id;
		this.deg = 0;
		this.power = 100;
		this.timer = null;
		this.state = "stop";
		this.speed = speed;
		this.dySys = dySys;
		this.powerSys = powerSys;
		this.orbit = PLANET_RADIUS + 50 * (id + 1) - SPACESHIP_WIDTH / 2;
	};

	Spaceship.prototype.dynamicSystem = function() {
		var self = this;
		var fly = function() {
			self.timer = setInterval(function() {
				self.deg += (self.speed * 360 * 0.02) / (2 * Math.PI * self.orbit);
				if(self.deg > 360) {
					self.deg = 0;
				}
			}, 20);
			ConsoleUtil.show("[消息]:飞船" + self.id+"号正在飞行", 0);
		};

		var stop = function() {
			clearInterval(self.timer);
			ConsoleUtil.show("[消息]:飞船" + self.id + "号停止飞行", 0);
		};

		return {
			fly: fly,
			stop: stop
		};
	};

	Spaceship.prototype.powerSystem = function() {
		var self = this;
		var charge = function() {
			var timer = setInterval(function() {
				if(self.state == "fly" || self.state == "destroy") {
					clearInterval(timer);
					return false;
				}
				if(self.power > 100) {
					clearInterval(timer);
					self.power = 100;
					return false;
				}
				self.power += self.powerSys;
				$(".my-av-power").eq(self.id).text(self.power.toFixed(2) + "%");
			}, 20);
			ConsoleUtil.show("[消息]:飞船" + self.id + "号正在充电", 0);
		};

		var discharge = function() {
			var timer = setInterval(function() {
				if(self.state == "stop" || self.state == "destroy") {
					clearInterval(timer);
					return false;
				}
				if(self.power < 0) {
					clearInterval(timer);
					self.power = 0;
					self.controler().changeState("stop");
					return false;
				}
				self.power -= self.dySys;
				$(".my-av-power").eq(self.id).text(self.power.toFixed(2) + "%");
			}, 20);
		};

		return {
			charge: charge,
			discharge: discharge
		};
	};

	Spaceship.prototype.controler = function() {
		var self = this;
		var states = {
			fly: function() {
				self.state = "fly";
				self.dynamicSystem().fly();
				self.powerSystem().discharge();
			},
			stop: function() {
				self.state = "stop";
				self.dynamicSystem().stop();
				self.powerSystem().charge();
			},
			destroy: function() {
				self.state = "destroy";
				self.mediator.remove(self);
			}
		};

		var changeState = function(state) {
			if(states[state]) {
				states[state]();
			}
		};

		return {
			changeState: changeState
		};
	};

	Spaceship.prototype.signalManager = function() {
		var self = this;
		var adapter = function(bin) {
			var list = ["launch", "fly", "stop", "destroy"];
			var id = bin.slice(0, 4);
			var cmd = bin.slice(4);
			cmd = list[parseInt(cmd, 2)];
			var msg = new Message(parseInt(id, 2), cmd);
			return msg;
		};

		return {
			receive: function(bin) {
				var msg = adapter(bin);
				if(msg.cmd !== self.state && self.id === msg.id) {
					self.controler().changeState(msg.cmd);
				}
			}
		};
	};

	var Commander = function() {
		this.id = "L";
		this.mediator = null;
	};

	Commander.prototype.send = function(msg) {
		this.mediator.send(msg);
	};

	var Mediator = function() {
		var spaceships = [];
		var commander = null;
		var adapter = function(msg) {
			var transition = {};
			var patch = "0000";
			var id = msg.id.toString(2);
			patch = patch.substring(0, patch.length - id.length) + id;

			transition.launch = "0000";
			transition.fly = "0001";
			transition.stop = "0010";
			transition.destroy = "0011";
			
			var bin = patch + transition[msg.cmd];
			return bin;
		};
		return {
			register: function(obj) {
				if(obj instanceof Commander) {
					obj.mediator = this;
					commander = obj;
					ConsoleUtil.show("[消息]:指挥者注册成功", 0);
					return true;
				} else if(obj instanceof Spaceship) {
					obj.mediator = this;
					spaceships[obj.id] = obj;
					return true;
				} else {
					ConsoleUtil.show("[警告]:注册失败", 1);
					return false;
				}
			},
			remove: function(obj) {
				if(obj instanceof Commander) {
					obj.mediator = null;
					commander = null;
					ConsoleUtil.show("[消息]:指挥者注销成功", 0);
					return true;
				} else if(obj instanceof Spaceship) {
					obj.mediator = null;
					spaceships[obj.id] = null;
					$(".my-wrapper").eq(obj.id).css("display", "none");
					ConsoleUtil.show("[消息]:飞船" + obj.id + "号注销成功", 0);
					return true;
				} else {
					ConsoleUtil.show("[警告]:注销失败", 1);
					return false;
				}
			},
			send: function(msg, to) {
				var self = this;
				setTimeout(function() {
					var success = Math.random() > FAILURE_RATE ? true : false;
					if(success) {
						var bin = adapter(msg);
						if(to) {
							to.signalManager().receive(bin);
						} else {
							if(msg.cmd == "launch") {
								self.create(msg);
							}
							for(var i = 0; i < SPACESHIP_COUNT; i++) {
								if(spaceships[i] != null) {
									spaceships[i].signalManager().receive(bin);
								}
							}
						}
					} else {
						ConsoleUtil.show("[警告]:您的消息发生了丢包,已重发", 1);
						self.send(msg);
					}
				}, 300);
			},

			create: function(msg) {
				if(spaceships[msg.id] != undefined) {
					ConsoleUtil.show("[警告]:飞船" + msg.id + "号已经存在", 1);
				}
				var transition = {
					"d1": {"1": SMALL_DISCHARGE_RATE, "2": LOW_SPACESHIP_SPEED},
					"d2": {"1": MEDIUM_DISCHARGE_RATE, "2": MEDIUM_SPACESHIP_SPEED},
					"d3": {"1": STRONG_DISCHARGE_RATE, "2": HIGN_SPACESHIP_SPEED},
					"p1": SMALL_CHARGE_RATE,
					"p2": MEDIUM_CHARGE_RATE,
					"p3": STRONG_CHARGE_RATE
				};
				var transition1 = {
					"d1": "[前进号]",
					"d2": "[奔腾号]",
					"d3": "[超越号]",
					"p1": "[劲量型]",
					"p2": "[光能型]",
					"p3": "[永久型]"
				};
				var dySys = $("input[name='dynamic']:checked").val();
				var powerSys = $("input[name='power']:checked").val();
				var spaceship = new Spaceship(msg.id, transition[dySys][1], transition[dySys][2], transition[powerSys]);
				ConsoleUtil.show("[消息]:" + transition1[dySys] + transition1[powerSys] + "飞船" + msg.id + "号创建成功", 0);
				$(".my-dynamic").eq(msg.id).text(transition1[dySys]);
				$(".my-power").eq(msg.id).text(transition1[powerSys]);
				$(".my-av-power").eq(msg.id).text("100.00%");
				$(".my-wrapper").eq(msg.id).css("display", "block");
				this.register(spaceship);
			},

			getSpaceships: function() {
				return spaceships;
			},

			getIdle: function() {
				for(var i = 0; i < SPACESHIP_COUNT; i++) {
					if(spaceships[i] == null) {
						break;
					}
				}
				if(i == SPACESHIP_COUNT) {
					ConsoleUtil.show("[警告]:轨道已满", 1);
					return -1;
				} else {
					return i;
				}
			}
		};
	};

	var Message = function(target, command) {
		this.id = target;
		this.cmd = null;
		switch(command) {
			case "launch":
			case "fly":
			case "stop":
			case "destroy":
				this.cmd = command;
				break;
			default: 
				ConsoleUtil.show("[警告]:指令错误", 1);
		}
	};

	var buttonHandler = function(commander) {
		var id = null;
		var cmd = null;

		$(".my-btn").click(function() {
			var cmdName = $(this).attr("name");
			switch(cmdName) {
				case "launch":
					id = mediator.getIdle();
					cmd = cmdName;
					break;
				case "fly":
				case "stop":
				case "destroy":
					id = $(this).parent().index();
					cmd = cmdName;
					break;
				default: 
					ConsoleUtil.show("[警告]:指令不合法", 1);
			}
			if(id != -1) {
				var message = new Message(id, cmd);
				commander.send(message);
			}
		});
	};

	var AnimUtil = (function() {
		var canvas = document.getElementById("my-canvas");
		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;
		var ctx = canvas.getContext("2d");

		var cacheCanvas = document.createElement("canvas");
		cacheCanvas.width = SCREEN_WIDTH;
		cacheCanvas.height = SCREEN_HEIGHT;
		var cacheCtx = cacheCanvas.getContext("2d");

		var drawPlanet = function(_ctx) {
			var x = SCREEN_CENTER_X - PLANET_RADIUS;
			var y = SCREEN_CENTER_Y - PLANET_RADIUS;
			var planet = new Image();
			planet.src = "planet.png";
			planet.onload = function() {
				_ctx.drawImage(planet, x, y, PLANET_RADIUS * 2, PLANET_RADIUS * 2);
			};
		};

		var drawSpaceship = function(_ctx, spaceship) {
			var spaceshipImg = new Image();
			spaceshipImg.src = "spaceship.png";
			spaceshipImg.onload = function() {
				_ctx.save();
				_ctx.translate(SCREEN_CENTER_X, SCREEN_CENTER_Y);
				_ctx.rotate(-spaceship.deg * Math.PI / 180);

				_ctx.beginPath();
				if(spaceship.power >= 60) {
					_ctx.strokeStyle = POWERBAR_COLOR_GOOD;
				} else if(spaceship.power < 60 && spaceship.power >= 20) {
					_ctx.strokeStyle = POWERBAR_COLOR_MEDIUM;
				} else {
					_ctx.strokeStyle = POWERBAR_COLOR_BAD;
				}

				_ctx.lineWidth = POWERBAR_WIDTH;
				_ctx.moveTo(spaceship.orbit, -POWERBAR_POS_OFSET);
				_ctx.lineTo(spaceship.orbit + SPACESHIP_WIDTH * (spaceship.power / 100), -POWERBAR_POS_OFSET);
				_ctx.stroke();

				_ctx.drawImage(spaceshipImg, spaceship.orbit, 0, SPACESHIP_WIDTH, SPACESHIP_HEIGHT);
				_ctx.restore();
				ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
				ctx.drawImage(cacheCanvas, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
			};
		};

		var drawObrit = function(_ctx) {
			for(var i = 0; i < ORBIT_COUNT; i++) {
				_ctx.strokeStyle = "#fff";
				_ctx.beginPath();
				_ctx.arc(SCREEN_CENTER_X, SCREEN_CENTER_Y, PLANET_RADIUS + 50 * (i + 1), 0, 2 * Math.PI);
				_ctx.closePath();
				_ctx.stroke();
			} 
		};

		(function() {
			var canvas = document.getElementById("my-background");
			canvas.width = SCREEN_WIDTH;
			canvas.height = SCREEN_HEIGHT;
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
			drawPlanet(ctx);
			drawObrit(ctx);
		})();

		var ondraw = function(spaceships) {
			if(!(spaceships == undefined || spaceships.every(function(item, index, array) {
				return item == undefined;
			}))) {
				cacheCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
				for(var i = 0; i < spaceships.length; i++) {
					if(spaceships[i] != undefined) {
						drawSpaceship(cacheCtx, spaceships[i]);
					}
				}
			} else {
				ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
			}
		};

		var setMediator = function(_mediator) {
			mediator = _mediator;
		};

		var animLoop = function() {
			requestAnimationFrame(animLoop);
			ondraw(mediator.getSpaceships());
		};

		return {
			setMediator: setMediator,
			animLoop: animLoop
		};
	})();

	var ConsoleUtil = (function() {
		var $consoleLog = $("#my-msg");
		var show = function(string, classType) {
			var $msg = $("<li></li>");
			$msg.text(string);
			if(classType == 0) {
				$msg.addClass("my-info");
			} else {
				$msg.addClass("my-warning");
			}
			$consoleLog.append($msg);
			$consoleLog.scrollTop($consoleLog.height());
		};
		return {
			show: show
		};
	})();

	window.onload = function() {
		var commander = new Commander();
		var mediator = new Mediator();
		mediator.register(commander);
		buttonHandler(commander);
		AnimUtil.setMediator(mediator);
		AnimUtil.animLoop();
	};
})();