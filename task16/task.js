/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var $ = function(id) {
    return document.getElementById(id);
}
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = $('aqi-city-input').value.trim();
    var qual = $('aqi-value-input').value.trim();
    var patt1 = /^[\u4e00-\u9fa5a-zA-Z]+$/g;
    var patt2 = /^[1-9]\d*$/g;
    if(city === '' || qual === '') {
        alert("请输入内容！");
        return;
    }
    if (!patt1.test(city)) {
        alert("城市名称必须为中英文字符！");
        return;
    }
    if(!patt2.test(qual)) {
        alert("空气指数必须为整数！");
        return;
    }
    aqiData[city] = qual;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var aqiTable = $('aqi-table');
    var html = '';
    html += ''
        + '<tr>'
        +    '<td>城市</td><td>空气质量</td><td>操作</td>'
        + '</tr>'
    for(var key in aqiData) {
        if(aqiData.hasOwnProperty(key)) {
            html += '<tr>'
                 +      '<td>' + key + '</td><td>' + aqiData[key] + '</td><td><button>删除</button></td>';
        }
    }
    aqiTable.innerHTML = html;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
    var paren = e.target.parentNode.parentNode;
    var city = paren.childNodes[0].innerHTML;
    delete aqiData[city];
    renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

    $('add-btn').onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    $('aqi-table').onclick = delBtnHandle;

}

init();
