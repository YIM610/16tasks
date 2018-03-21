function ItemCreate(ipt, box) {
	this.arr = [];
	this.box = box;
	this.ipt = ipt;
	this.maxLen = 100;
	this.init();
}

ItemCreate.prototype = {
	init: function() {
		on(this.box, "click", this.deleteItem.bind(this));
		on(this.ipt, "keyup", this.ketUp.bind(this));
		on(this.ipt, "keydown", this.preventDefault);
	},
	ketUp: function(e) {
		if(e.keyCode == 188 || e.keyCode == 32 || e.keyCode == "13") {
			this.add();
			this.ipt.value = "";
		}
	},
	preventDefault: function(e) {
		if(e.keyCode == "13") {
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		}
	},
	noRepeat: function() {
		var newArr = [];
		var len = this.arr.length;
		for(var i = 0; i < len; i++) {
			if(newArr.indexOf(this.arr[i]) == -1) {
				newArr.push(this.arr[i]);
			}
		}
		this.arr = newArr;
		while(this.arr.length > this.maxLen) {
			this.arr.shift();
		}
		this.show();
		return this;
	},
	show: function() {
		var html = "";
		for(var i = 0; i < this.arr.length; i++) {
			html += "<div data-num='" + i + "' class='item'><span>点击删除</span>" + this.arr[i] + "</div>";
		}
		this.box.innerHTML = html;
		return this;
	},
	add: function() {
		str = this.ipt.value.split(/[ ,、， \n\t]/);
		for(var i = 0; i < str.length; i++) {
			var item = str[i];
			if(item != "") {
				this.arr.push(item);
			}
		}
		this.noRepeat();
		return this;
	},
	deleteItem: function(e) {
		var item = e.target.className == "item" ? e.target : e.target.parentNode.className == "item" ? e.target.parentNode : null;
		if(item == null) {
			return 0;
		}
		this.arr.splice(item.getAttribute("data-num"), 1);
		this.show();
	},
	getData: function() {
		return this.arr;
	}
};