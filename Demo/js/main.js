(function() {
	function Item(task, name, intro) {
		this.task = task;
		this.name = task + ":" + name;
		this.demo ="https://yim610.github.io/16tasks/" + task;
		this.setIntro();
		this.addItem();
	}

	Item.prototype.addItem = function() {
		var self = this;
		var $tasks = $("#my_task")
		var $div = $("<div class='col-sm-4 my_task_item'></div>");
		var $h3 = $("<h3></h3>").append(self.name);
		var $a = $("<a></a>").attr("href", self.intro).append("任务介绍");
		var $demo = $("<a class='btn btn-default my_btn'></a>").attr("href", self.demo).append("在线演示");
		$div.append($div).append($h3).append($a).append($demo);
		$tasks.append($div);
	};

	Item.prototype.setIntro = function() {
		var patt = /^task(\d+)(,\d+)*$/;
		var matches = patt.exec(this.task);
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

	};

	new Item("task38", "UI组件之排序表格");
	new Item("task37", "UI组件之浮出层");
	new Item("task33,34,35,36", "听指令的小方块（一）（二）（三）（四）");
	new Item("task32", "表单（四）实现表单自动生成工厂");
	new Item("task31", "表单（三）联动");
	new Item("task29,30", "表单（一）单个（二）多个表单项的动态校验");
	new Item("task26,27,28", "行星与飞船（一）（二）（三）");
	new Item("task24,25", "JavaScript和树（三）（四）");
	new Item("task23", "JavaScript和树（二）");
	new Item("task22", "JavaScript和树（一）");
	new Item("task19", "基础JavaScript练习（二）");
	new Item("task18", "基础JavaScript练习（一）");
	new Item("task17", "零基础JavaScript编码（五）");
	new Item("task16", "零基础JavaScript编码（四）");
	new Item("task15", "零基础JavaScript编码（三）");
	new Item("task14", "零基础JavaScript编码（二）");
	new Item("task13", "零基础JavaScript编码（一）");
	new Item("task12", "学习CSS 3的新特性");
	new Item("task11", "移动Web页面布局实践");
	new Item("task10", "Flexbox 布局练习");
	new Item("task9", "使用HTML/CSS实现一个复杂页面");
	new Item("task8", "响应式网格（栅格化）布局");
	new Item("task7", "实现常见的技术产品官网的页面架构及样式布局");
	new Item("task6", "通过HTML及CSS模拟报纸排版");
	new Item("task5", "零基础HTML及CSS编码（二）");
	new Item("task4", "定位和居中问题");
	new Item("task3", "三栏式布局");
	new Item("task2", "零基础HTML及CSS编码（一）");
	new Item("task1", "零基础HTML编码");
})();