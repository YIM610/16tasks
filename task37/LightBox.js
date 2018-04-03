function LightBox(title, tip, button, container, conformFun, cancelFun) {
	this.title = title;
	this.tip = tip;
	this.btn = button;
	this.container = container;
	this.conformFun = conformFun || null;
	this.cancelFun = cancelFun || null;
	this.init();
}


LightBox.prototype.init = function() {
	var self = this;

	self.mask = self.controller().createEle("div", null, "mask hide");
	var titleHTML = "<p>" + self.title + "</p>";

	var head = self.controller().createEle("div", titleHTML, "tip_header");
	var tipBox = self.controller().createEle("div", self.tip, "tip_content");
	var btnBox = self.controller().createEle("div", null, "btn_wrap");
	var conformBtn = self.controller().createEle("button", "确认", "conform");
	var cancelBtn = self.controller().createEle("button", "取消", "cancel");

	tipBox.append(btnBox);
	btnBox.append(conformBtn);
	btnBox.append(cancelBtn);
	self.container.append(head);
	self.container.append(tipBox);
	document.body.append(self.mask);

	self.btn.onclick = function() {
		self.controller().showBox();
		self.controller().showMask();	
		self.controller().setDrag(head);
	};

	self.mask.onclick = function() {
		self.controller().hideBox();
		self.controller().hideMask();
	};

	window.onresize = function() {
		if(self.container.className == "show") {
			self.controller().setCenter(self.container);
			self.controller().showMask();	
		}
	};

	conformBtn.onclick = function() {
		if(self.conformFun) {
			self.conformFun();
		}
		self.controller().hideBox();
		self.controller().hideMask();
	};

	cancelBtn.onclick = function() {
		if(self.cancelFun) {
			self.cancelBtn();				
		}
		self.controller().hideBox();
		self.controller().hideMask();
	};
};

LightBox.prototype.controller = function() {
	var self = this;
	var showBox = function() {
		self.container.className = "show";
		setCenter(self.container);
	};

	var setCenter = function(box) {
		var bodyW = document.documentElement.clientWidth;
		var bodyH = document.documentElement.clientHeight;

		var offsetW = box.offsetWidth;
		var offsetH = box.offsetHeight;
		box.style.left = (bodyW - offsetW) / 2 + "px";
		box.style.top = (bodyH - offsetH) / 2 + "px";
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

	var hideBox = function() {
		self.container.className = "hide";
	};

	var showMask = function() {
		var bodyW = document.documentElement.scrollWidth;
		var bodyH = document.documentElement.scrollHeight;

		self.mask.style.width = bodyW + "px";
		self.mask.style.height = bodyH + "px";

		self.mask.className = "mask show";
	};

	var hideMask = function() {
		self.mask.className = "mask hide";
	};

	var setDrag = function(node) {
		node.onmousedown = function(e) {
			e.preventDefault();
			var pageW = document.documentElement.clientWidth;
		    var pageH = document.documentElement.clientHeight;

		    var myW = self.container.offsetWidth;
		    var myH = self.container.offsetHeight;

		    var maxMoveX = pageW - myW;
		    var maxMoveY = pageH - myH;

			var x = e.clientX - self.container.offsetLeft;
			var y = e.clientY - self.container.offsetTop;

			document.onmouseup = function(e1) {
				e1.preventDefault();
				document.onmousemove = null;
			};

			document.onmousemove = function(e2) {
				e2.preventDefault();
			    var moveX = Math.min(maxMoveX, Math.max(0, e2.clientX - x));
			    var moveY = Math.min(maxMoveY, Math.max(0, e2.clientY - y));
			    self.container.style.left = moveX + "px";
			    self.container.style.top = moveY + "px";
			};
		};		
	};

	return {
		showBox: showBox,
		hideBox: hideBox,
		setCenter: setCenter,
		createEle: createEle,
		showMask: showMask,
		hideMask: hideMask,
		setDrag: setDrag
	};
};