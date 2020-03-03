//
var cur_timer = 5;
var global_timeout;
var run_status = true;

//open window function
function openwindow() {
	chrome.tabs.create({
		url: chrome.extension.getURL('popup.html'),
		active: false
	}, function(tab) {
		// After the tab has been created, open a window to inject the tab
		chrome.windows.create({
			tabId: tab.id,
			type: 'popup',
			focused: true
			// incognito, top, left, ...
		});
	});
};
//timer call windown every timer out


function change_icon(app_status) {
	var icons_list = {'run':'icons/icon_run.png', 'stop':'icons/icon_stop.png'};
    chrome.browserAction.setIcon({path: icons_list[app_status]});
}

function set_timer(timer){
	var interval_timout;
	interval_timout = setInterval(openwindow, timer* 60* 1000);
	run_status = true;
	change_icon('run');	
	return interval_timout;
};

document.addEventListener('DOMContentLoaded', function () {
	openwindow();
	global_timeout = set_timer(cur_timer);
	chrome.browserAction.onClicked.addListener(function () {
		if(run_status){
			clearInterval(global_timeout);
			change_icon('stop');
			run_status = false;
		} else {
			clearInterval(global_timeout);
			global_timeout = set_timer(cur_timer);
			change_icon('run');			
			openwindow();
		};
	});
});

