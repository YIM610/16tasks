var btns = document.getElementsByClassName("btn");
var prebtn = btns[0], inbtn = btns[1], postbtn = btns[2];
var root = document.getElementsByClassName("root")[0];
var nodelist = [], timer = null;

window.onload=function() {
	prebtn.onclick = function() {
		reset();
		preOrder(root);
		visit();
	}
	inbtn.onclick = function() {
		reset();
		inOrder(root);
		visit();
	}
	postbtn.onclick = function() {
		reset();
		postOrder(root);
		visit();
	}
}

function preOrder(node) {
	if(node != null) {
		nodelist.push(node);
		preOrder(node.firstElementChild);
		preOrder(node.lastElementChild);
	}
}

function inOrder(node) {
	if(node != null) {
		inOrder(node.firstElementChild);
		nodelist.push(node);
		inOrder(node.lastElementChild);
	}
}

function postOrder(node) {
	if(node != null) {
		postOrder(node.firstElementChild);
		postOrder(node.lastElementChild);
		nodelist.push(node);
	}
}

function visit(node) {
	var i = 0;
	nodelist[i].style.backgroundColor = "pink";
	timer = setInterval(function() {
		i++;
		if(i < nodelist.length) {
			nodelist[i - 1].style.backgroundColor = "white";
			nodelist[i].style.backgroundColor = "pink";
		}
		else {
			clearInterval(timer);
			nodelist[nodelist.length - 1].style.backgroundColor = "white";
		}
	}, 500);
}

function reset() {
	nodelist = [];
	clearInterval(timer);
	var divs = document.getElementsByTagName("div");
	var divlen = divs.length;
	for(var i = 0; i < divlen; i++) {
		divs[i].style.backgroundColor = "white";
	}
}