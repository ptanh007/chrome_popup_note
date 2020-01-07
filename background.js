//timer milisecond
//var timer = 5*60*1000
var timer = 5*60*10//test value
//open window function
function openwindow() {
	window.open("popup.html", "extension_popup", "width=300,height=400,status=no");	
};
//timer call windown every timer out
setTimeout(openwindow,timer);
