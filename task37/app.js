var html = "<p>这是浮出层的内容，可以自行设置为表单，文字或图片等。传参时还可以设置点击下面两个按钮时执行的函数。点击按钮或遮罩关闭此框</p>";
var button = document.getElementById("btn");
var cont = document.getElementById("container");
new LightBox("这是自定义的浮出层标题", html, button, cont);