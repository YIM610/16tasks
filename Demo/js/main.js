(function() {
	function Item(task, name, intro) {
		this.name = task + ":" + name;
		this.demo ="https://yim610.github.io/16tasks/" + task;
		this.setIntro();
	}

	Item.prototype.addItem = function() {
		var self = this;
		var $tasks = $("#my_task")
		var $div = $("<div class='col-sm-4'></div>");
		var $h3 = $("<h3></h3>").append(self.name);
		var $a = $("<a></a>").attr("href", self.intro).append("任务介绍");
		var $demo = $("<a class='btn btn-default my_btn'></a>").attr("href", self.demo).append("在线演示");
		$div.append($div).append($h3).append($a).append($demo);
		$tasks.append($div);
	};

	Item.prototype.setIntro = function() {
		var patt = /^task(\d+)(,\d+):/;
		var matches = patt.exec(this.name);
		if(matches && matches[1]) {
			var taskId = null;
			if(matches[2]) {
				var list = matches[2].split(",");
				taskId = list[list.length - 1];
			} else {
				taskId = matches[1];
			}
			this.intro = "http://ife.baidu.com/2016/task/detail?taskId=" + taskId;
		}

	}

	var item = new Item("task1", "零基础HTML编码");
	item.addItem();
})();