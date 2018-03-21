var dataCrea = new DataCreate(data_box);
var itemCrea = new ItemCreate(data_box.item_box[0], data_box.item_box[1]);
var formArr = [];

on(dataCrea.box.add_btn, "click", function() {
	var data = dataCrea.getData();
	if(data != null) {
		dataCrea.addForm(data);
		formArr.push(new Form(data));
		if(data.type == "radio" || data.type == "checkbox") {
			formArr[formArr.length - 1].default_tip();
		}
	}
	return false;
});

on(data_box.submit_btn, "click", function(e) {
	var text = "";
	for(var i = 0; i < formArr.length; i++) {
		text += !formArr[i].validator() ? formArr[i].tip.textContent + "\n" : "";
	}
	text == "" ? alert("提交成功") : alert(text);
	return false;
});