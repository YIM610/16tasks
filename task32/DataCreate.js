function DataCreate(data_box) {
	this.box = data_box;
	this.id = 0;
	this.init();
}

DataCreate.prototype = {
	init: function() {
		on($("#data_create"), "change", this.showTable.bind(this));
		on(this.box.style_box.box, "change", this.setStyle.bind(this));
	},
	getText: function(data_box) {
		return data_box.box[data_box.value];
	},
	showTable: function(e) {
		if(e.target.getAttribute("type") == "radio") {
			e.target.parentNode.className = e.target.id;
			if(!/necessary/.test(e.target.id)) {
				this.box.name_box.box.value = e.target.nextElementSibling.textContent;
			}
		}
	},
	getData: function() {
		var data = {
			name: "",
			type: "",
			need: true,
			input_type: "",
			min_len: 0,
			max_len: 1,
			default_text: "",
			success_text: "",
			fail_text: "",
			item: [],
			id: 0,
			validator: function(){}
		};
		data = this.getBaseData(data);

		switch(data.type) {
			case "textarea":
				data = this.getLengthRealatedData(data);
				break;
			case "input":
				switch(data.input_type) {
					case "text":
					case "password":
						data = this.getLengthRealatedData(data);
						break;
					case "number":
					case "email":
					case "phone":
						data = this.getInputRelatedData(data);
						break;
				}
				break;
			case "radio":
			case "select":
			case "checkbox":
				data = this.getSpecialInputRelatedData(data);
				break;
		}
		return data;
	},
	getBaseData: function(data) {
		data.name = this.getText(this.box.name_box);
		data.type = this.getText(this.box.type_box);
		data.need = this.getText(this.box.need_box) == "necessary";
		data.input_type = this.getText(this.box.rule_box);
		data.id = "form" + this.id++;
		return data;
	},
	getLengthRealatedData: function(data) {
		data.min_len = this.getText(this.box.min_len_box);
		data.max_len = this.getText(this.box.max_len_box);
		data.fail_text = [
			data.name +"不能为空",
			data.name + "长度不能小于" + data.min_len + "个字符",
			data.name + "长度不能大于" + data.max_len + "个字符"
		];
		data.success_text = data.name + "格式正确";
		data.default_text = (data.need ? "必填" : "选填") + ",长度为" + data.min_len + "-" + data.max_len + "个字符";
		data.validator = validator.length_control;
		return data;
	},
	getInputRelatedData: function(data) {
		data.input_type = this.getText(this.box.rule_box);
		data.fail_text = [
			data.name + "不能为空",
			data.name + "格式不正确"
		];
		data.success_text = data.name + "格式正确";
		data.default_text = (data.need ? "必填" : "选填") + ".请输入您的" + data.name;
		data.validator = validator[data.input_type];
		return data;
	},
	getSpecialInputRelatedData: function(data) {
		var items = this.box.item_box[2];
		data.item = [];
		for(var i = 0; i < items.length; i++) {
			data.item.push(items[i].childNodes[1].data);
		}
		if(data.item.length == 0) {
			alert("您还没有添加" + data.name + "的选项");
			data = null;
		}
		else if(data.item.length == 1) {
			alert("您只添加了一个选项，无法创建" + data.name);
			data = null;
		}
		else {
			data.default_text = (data.need ? "必填" : "选填") + "请选择您的" + data.name;
			data.fail_text = [data.name + "未选择"];
			data.success_text = data.name + "已选择";
			data.validator = validator[data.type];
		}

		return data;
	},
	addForm: function(data) {
		switch(data.type) {
			case "input":
				this.addInput(data);
				break;
			case "textarea":
				this.addTextArea(data);
				break;
			case "radio":
				this.addRadio(data);
				break;
			case "checkbox":
				this.addCheckbox(data);
				break;
			case "select":
				this.addSelect(data);
		}
	},
	addInput: function(data) {
		var box = document.createElement("div");
		box.innerHTML = "<label>" + data.name + "</label><input type='" + data.input_type + "' id='" + data.id + "'><span></span>";
		this.box.result_box.insertBefore(box, this.box.submit_btn);
	},
	addTextArea: function(data) {
		var box = document.createElement("div");
		box.innerHTML = "<label>" + data.name + "</label><textarea id='" + data.id + "'></textarea><span></span>";
		this.box.result_box.insertBefore(box, this.box.submit_btn);
	},
	addRadio: function(data) {
		var box = document.createElement("div");
		var html = "";
		box.className = "radio_box";
		html += "<div id='" + data.id + "'><label class='formNameLabel'>" + data.name + "</label>";
		for(var i = 0; i < data.item.length; i++) {
			var id = data.id + "" + i;
			html += "<input type='radio' id='" + id + "' name='" + data.id + "'><label for='" + id + "'>" + data.item[i] + "</label>";
		}
		html += "</div><span></span>";
		box.innerHTML = html;
		this.box.result_box.insertBefore(box, this.box.submit_btn);
	},
	addCheckbox: function(data) {
		var box = document.createElement("div");
		var html = "";
		box.className = "radio_box";
		html += "<div id='" + data.id + "'><label class='formNameLabel'>" + data.name + "</label>";
		for(var i = 0; i < data.item.length; i++) {
			var id = data.id + "" + i;
			html += "<input type='checkbox' id='" + id + "' name='" + data.id + "'><label for='" + id + "'>" + data.item[i] + "</label>";
		}
		html += "</div><span></span>";
		box.innerHTML = html;
		this.box.result_box.insertBefore(box, this.box.submit_btn);
	},
	addSelect: function(data) {
		var box = document.createElement("div");
		var html = "";
		html += "<lable>" + data.name + "</label><select id='" + data.id + "'>";
		for(var i = 0; i < data.item.length; i++) {
			html += "<option>" + data.item[i] + "</option>";
		}
		html += "</select><span></span>";
		box.innerHTML = html;
		this.box.result_box.insertBefore(box, this.box.submit_btn);
	},
	setStyle: function() {
		var text = this.getText(this.box.style_box);
		console.log(text);
		this.box.result_box.className = (text == "样式一") ? "style1" : "style2";
	}
};