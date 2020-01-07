//timer milisecond
var timer = 5*60*10
function openwindow() {
	window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");	
};

setTimeout(openwindow,timer);
