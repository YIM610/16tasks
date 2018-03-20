var items = [];
var item = document.getElementById("input");
var error = document.getElementById("error");

function leftin() {
	if(/^[1-9]?[0-9]?$/.test(item.value)) {
		items.unshift(item.value);
		error.style.display = "none";
	}
	else {
        error.style.display = "block";
	}
    render();
}

function rightin() {
	if(/^[1-9]?[0-9]?$/.test(item.value)) {
		items.push(item.value);
		error.style.display = "none";
	} else {
		error.style.display = "block";
	}
	render();
}

function leftout() {
    var delitem = items.shift();
    render();
    alert(delitem);
}

function rightout() {
	var delitem = items.pop();
	render();
	alert(delitem);
}

function render() {
    var html = '';
    var length = items.length;
    var container = document.getElementById("container");
    for(var i = 0; i < length; i++) {
    	html += '<div class="item" onclick="del(' + i + ')">' + items[i] + '</div>'
    }
    container.innerHTML = html;
}

function del(i) {
    items.splice(i, 1);
    render();
}