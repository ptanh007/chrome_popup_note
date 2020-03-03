//
var cur_timer = 1;
var global_timeout;
var run_status = true;

//open window function
function openwindow() {
	chrome.tabs.create({
		'url': chrome.runtime.getURL("popup.html")
	});
}
/*function openwindow() {
	var current_win = window.open("popup.html", "extension_popup", "width=300,height=450,status=no");	
	current_win.onload = function() {
		current_win.document.getElementById("timer").value = cur_timer;
		var typingTimer;
		current_win.document.getElementById("timer").addEventListener("keyup",function() {
			// Handle key press
			var key = event.keyCode;
			key = String.fromCharCode(key);
			var regex = /[0-9]/;
			if( !regex.test(key) ) {
			event.returnValue = false;
			if(event.preventDefault) event.preventDefault();
			};
			clearTimeout(typingTimer);
			typingTimer = setTimeout(
				function() {
					clearInterval(global_timeout);
					var new_timer = parseInt(current_win.document.getElementById("timer").value);
					if(new_timer>=0){
						cur_timer = new_timer;
					};
					current_win.document.getElementById("timer").value = cur_timer;
					global_timeout = set_timer(cur_timer);
				}, 2000);
		});
	};
};*/
//timer call windown every timer out


function change_icon(app_status) {
	var icons_list = {'run':'icons/icon_run.png', 'stop':'icons/icon_stop.png'};
    chrome.browserAction.setIcon({path: icons_list[app_status]});
}

function createNoti() {
	console.log("start nnotify");
	var notiOptions = {
		type: "basic",
		iconUrl:"icon.png",
		title: "Tempo",
		message: "Enter a note\n" +
			"chrome-extension://abhbgackhipcaopfapfhfpfhcnjhcejo/popup.html"
	};
	chrome.notifications.create("TempoNotify", notiOptions, didNotifed);
}

function didNotifed() {
	console.log("notified");
}
function set_timer(timer){
	var interval_timout = setInterval(createNoti, timer* 60* 1000);
	//interval_timout = setInterval(openwindow, timer* 60* 1000);
	run_status = true;
	change_icon('run');	
	return interval_timout;
}

document.addEventListener('DOMContentLoaded', function () {
	//openwindow();
	//global_timeout = set_timer(cur_timer);
	chrome.browserAction.onClicked.addListener(function () {
		if(run_status){
			clearInterval(global_timeout);
			change_icon('stop');
			run_status = false;
		} else {
			createNoti();
			clearInterval(global_timeout);
			global_timeout = set_timer(cur_timer);
			change_icon('run');			
			openwindow();
		}
	});
});

