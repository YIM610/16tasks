var data_box = {
	type_box: {
		box: $("#type_box"),
		value: "className"
	},
	name_box: {
		box: $("#name_box"),
		value: "value"
	},
	need_box: {
		box: $("#config_box"),
		value: "className"
	},
	style_box: {
		box: $("#select_box"),
		value: "value"
	},
	rule_box: {
		box: $("#rule_box"),
		value: "className"
	},
	min_len_box: {
		box: $("#min_len"),
		value: "value"
	},
	max_len_box: {
		box: $("#max_len"),
		value: "value"
	},
	item_box: [
		$("#item_box_input"),
		$("#item_box_show"),
		document.getElementsByClassName("item")
	],
	add_btn: $("#add_btn"),
	result_box: $("#result"),
	submit_btn: $("#submit_btn")
};

var validator = {
	"length_control": function() {
		var min_len = this.data.min_len;
		var max_len = this.data.max_len;
		var text = this.ipt.value;
		if(text == "") {
			if(this.data.need) this.error_tip(0);
			else {
				this.default_tip();
				return true;
			}
		} else {
			var len = (/[\x00-\xff]/.test(text) ? text.match(/[\x00-\xff]/g).length : 0) + (/[^\x00-\xff]/.test(text) ? text.match(/[^\x00-\xff]/g).length * 2 : 0);
			if(len < min_len) {
				this.error_tip(1);
			} else if(len > max_len) {
				this.error_tip(2);
			} else {
				this.true_tip();
				return true;
			}
		}
		return false;
	},
	"number": function() {
		var text = this.ipt.value;
		if(text == "") {
			if(this.data.need) {
				this.error_tip(0);
			} else {
				this.default_tip();
				return true;
			}
		} else {
			if(/^\d*$|^-\d*$/.test(text)) {
				this.true_tip();
				return true;
			} else {
				this.error_tip(1);
			}
		}
		return false;
	},
	"email": function() {
		var text = this.ipt.value;
		if(text == "") {
			if(this.data.need) {
				this.error_tip(0);
			} else {
				this.default_tip();
				return true;
			}
		} else {
			if(/^[0-9a-z]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]+.){1,63}[a-z0-9]+$/.test(text)) {
				this.true_tip();
				return true;
			} else {
				this.error_tip(1);
			}
		}
		return false;
	},
	"phone": function() {
		var text = this.ipt.value;
		if(text == "") {
			if(this.data.need) {
				this.error_tip(0);
			} else {
				this.default_tip();
				return true;
			}
		} else {
			if(/\d{11}/.test(text)) {
				this.true_tip();
				return true;
			} else {
				this.error_tip(1);
			}
		}
		return false;
	},
	"radio": function() {
		var item = $("#" + this.data.id).getElementsByTagName("input");
		for(var i = 0; i < item.length; i++) {
			if(item[i].checked) {
				this.true_tip();
				return true;
			}
		}
		if(this.data.need) {
			this.error_tip(0);
		} else {
			this.default_tip();
			return true;
		}
		return false;
	},
	"checkbox": function() {
		var children = this.ipt.children;
		for(var i in children) {
			if(children[i].checked) {
				this.true_tip();
				return true;
			}
		}
		if(this.data.need) {
			this.error_tip(0);
		} else {
			this.default_tip();
			return true;
		}
		return false;
	},
	"select": function() {
		this.true_tip();
		return true;
	}
};

function $(selector) {
	return document.querySelector(selector);
}

function on(ele, event, listener) {
	if(ele.addEvenetListener) {
		ele.addEvenetListener(event, listener, false);
	} else if(ele.attachEvent) {
		ele.attachEvent("on" + event, listener);
	} else {
		ele["on" + event] = listener;
	}
}