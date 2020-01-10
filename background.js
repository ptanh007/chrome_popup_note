//
var cur_timer = 0;

//open window function
function openwindow() {
	window.open("popup.html", "extension_popup", "width=300,height=450,status=no");	
};
//timer call windown every timer out


function change_icon(app_status) {
	var icons_list = {'run':'icons/icon_run.png', 'stop':'icons/icon_stop.png'};
    chrome.browserAction.setIcon({path: icons_list[app_status]});
}

function set_timer(timer){
	var interval_timout;
	if(timer){
		cur_timer = timer;
	} else {
		timer = cur_timer;
	};
	interval_timout = setInterval(openwindow,timer);
	return interval_timout;
};

document.addEventListener('DOMContentLoaded', function () {
	openwindow();
	var interval_timout;
	var run_status = true;
	chrome.browserAction.onClicked.addListener(function () {
		if(run_status){
			clearInterval(interval_timout);
			change_icon('stop');
			run_status = false;
		} else {
			interval_timout = set_timer();
			change_icon('run');			
		};
	});
	chrome.runtime.onMessage.addListener(function(message, sender, reply) {
		if (message.type == 'update timer run') {
		  clearInterval(interval_timout);
		  //timer on millisecond 
		  run_status = true;
		  change_icon('run');
		  timer = message.value * 60* 1000;
		  interval_timout = set_timer(timer);
		}
	});
});

