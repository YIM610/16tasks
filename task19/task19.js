var items = [];
var item = document.getElementById("input");
var error = document.getElementById("error");

function leftin() {
	if(items.length === 60) {
		alert("队列元素已满");
		return;
	}

	if(/^[1-9][0-9]{1}$|100/.test(item.value)) {
		items.unshift(item.value);
		error.style.display = "none";
		render("chart");
	}
	else {
        error.style.display = "block";
	}
}

function rightin() {
    if(items.length === 60) {
		alert("队列元素已满");
		return;
	}

	if(/^[1-9][0-9]{1}$|100/.test(item.value)) {
		items.push(item.value);
		error.style.display = "none";
		render("chart");
	} else {
		error.style.display = "block";
	}
	
}

function leftout() {
    var delitem = items.shift();
    render("chart");
    alert(delitem);
}

function rightout() {
	var delitem = items.pop();
	render("chart");
	alert(delitem);
}

function render(id) {
    var html = '';
    var length = items.length;
    var container = document.getElementById(id);
    for(var i = 0; i < length; i++) {
    	html += '<div class="item" onclick="del(' + i + ')" style="height: ' + items[i] * 2 + 'px; left: ' + i * 17 + 'px;"></div>'
    }
    container.innerHTML = html;
}

function del(i) {
    items.splice(i, 1);
    render("chart");
}

function sortRender() {
	var len = items.length;
	var temp, k;
	for(var i = 0; i < len - 1; i++) {
        k = i;
        for(var j = i + 1; j < len; j++) {
        	if(items[j] < items[k]) {
        		k = j;
        	}
        }
        if(i !== k) {
        	temp = items[i];
        	items[i] = items[k];
        	items[k] = temp;
        }
	}
	render("sortedChart");
}