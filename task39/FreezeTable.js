function FreezeTable(table) {
	this.table = table;
	this.th = table.firstElementChild.firstElementChild;
	this.len = table.firstElementChild.children.length;
	this.newTh = this.th.cloneNode(true);;
	this.init();
}

FreezeTable.prototype = {
	init: function() {
		var self = this;

		this.table.append(this.newTh);
		this.newTh.className = "first_line";
		this.newTh.style.display = "none";
		this.newTh.style.position = "fixed";
		this.newTh.style.top = 0;

		window.onscroll = function() {
			self.setPosition();
		};
	},

	setPosition :function() {
		var offsetT = this.table.offsetTop;
		var scrollT = document.documentElement.scrollTop||document.body.scrollTop;
		var offsetH = this.table.offsetHeight;
		if(scrollT > offsetH + offsetT || offsetT > scrollT) {
			this.newTh.style.display = "none";
		} else {
			this.newTh.style.display = "block";
		}
	}
};