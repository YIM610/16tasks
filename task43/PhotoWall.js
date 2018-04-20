var PhotoWall = function(ele) {
	this.container = ele;
	this.content = this.container.querySelectorAll("img");

	this.len = this.content.length;
	this.init();
};

PhotoWall.prototype = {
	init: function() {
		this.container.className += " album" + this.len;
	}
};