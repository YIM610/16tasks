;(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define([], factory);
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	} else {
		root.Waterfall = factory();
	}
}(this, function() {
	"use strict";

	var Waterfall = function(opts) {
		var opts = opts || {};
		var containerSelector = opts.containerSelector || "waterfallContainer";
		var boxSelector = opts.boxSelector || "waterfallBox";
		this.column = opts.column || 1;
		this.container = document.querySelector(containerSelector);
		this.boxes = this.container ? Array.prototype.slice.call(this.container.querySelectorAll(boxSelector)) : [];
		this.compose();
		var self = this;
		window.onload = function() {
			self.compose(true);
		}
	}

	Waterfall.prototype = {
		initColumn: function(columnNum) {
			this.columns = [];
			for(var i = 0; i < columnNum; i++) {
				var columnDiv = document.createElement("div");
				columnDiv.style.width = (100/columnNum) + "%";
				columnDiv.className = "waterfallColumn";
				this.columns.push(columnDiv);
				this.container.appendChild(columnDiv);
			}
		},

		getMinHeightIndex: function() {
			var min = this.columns[0].clientHeight;
			var index = 0;
			for(var i = 0; i < this.columns.length; i++) {
				if(this.columns[i].clientHeight < min) {
					min = this.columns[i].clientHeight;
					index = i;
				}
			}
			return index;
		},

		compose: function(force) {
			if(force) {
				for(var i = 0; i < this.columns.length; i++) {
					this.columns[i].remove();
				}
			}

			this.initColumn(this.column);
			for(var i = 0, l = this.boxes.length; i < l; i++) {
				var box = this.boxes[i];
				this.addBox(box);
			}
		},

		addBox: function(ele) {
			var index = this.getMinHeightIndex();
			var column = this.columns[index];
			column.appendChild(ele);
		}
	}

	return Waterfall;
}))