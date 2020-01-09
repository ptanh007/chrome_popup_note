function update_display(history_data){
	var history_text = '';
	for (var i = history_data.length-3; i < history_data.length; i++) {
		var display_text = ''
		if(i>=0){
			history_text = history_text.concat(create_text(history_data[i]));
		};
	};	

	// get previous notes
	document.getElementById("history_note").value = history_text;
	// update time display
	var new_data = new Date();
	var hours = new_data.getHours().toString();
	var minutes = new_data.getMinutes().toString();
	var time = hours.concat(":", minutes) ;
	document.getElementById("time_note").value = time;
	//reset input note
	document.getElementById("note_input").value = "";
};
function create_text(data) {
	var text_data = '';
	var whiteSpace = '';
	var level = get_obj_value(data, 'level') || 0;
	var obj_time = get_obj_value(data, 'time') || 'NA';
	var value = get_obj_value(data, 'value') || '';
	for(var j= 0; j < level; j++) {
		whiteSpace = whiteSpace.concat('   ');
	};
	text_data = text_data.concat(obj_time,':');
	text_data = text_data.concat(value, '\n');
	text_data = whiteSpace + text_data.split('\n').join(whiteSpace + '\n') ;
	return text_data;
};
function get_obj_value(obj, key){
	if(typeof(obj)==='object' && key in obj){
		return obj[key]
	} else {
		return false
	};
};

function get_storage() {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(['history_data'], function(result) {
			if('history_data' in result){
				resolve(result.history_data);
			} else {
				resolve([]);
			};
		});
	});
};
function update(data, display_only=false){
	get_storage().then(function(value) {
		if(!display_only) {
			value.push(data);
		};
		update_display(value);
		chrome.storage.local.set({'history_data': value});
    });
};

function get_new_data() {
	//get new note value
	var level_e = document.getElementById('level');
	var level = parseInt(level_e.options[level_e.selectedIndex].value);
	var input_note = document.getElementById("note_input").value;
	var time = document.getElementById("time_note").value;
	//storage note to local memory
	var new_data = {'level':level,'value':input_note, 'time':time};
	return new_data;
};
function closeWin() {
  window.close();   // Closes the new window
  return null;
};
function stop_background() {
	chrome.runtime.sendMessage({type: 'stop timer run'});
};

function export_csv() {
	get_storage().then(function(data_tbl) {
		var csv_data = '';
		//create csv data
		for(var line of data_tbl){
			csv_data = csv_data.concat(line['time'],';');
			csv_data = csv_data.concat(line['level'],';');
			csv_data = csv_data.concat(line['value'],';', '\n');
		};
		//creative new log file
		var link = document.createElement("a");
		var data_type = "data:text/csv"
		link.textContent = "Save as CSV";
		link.download = "file.csv";

		link.href = data_type.concat(",", csv_data);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});
};

function export_text() {
	get_storage().then(function(data_tbl) {
		var text_data = '';
		//create csv data
		for(var line of data_tbl){
			text_data = text_data.concat(create_text(line));
		};
		//creative new log file
		var link = document.createElement("a");
		var data_type = "data:text"
		link.textContent = "Save as TEXT";
		link.download = "file.txt";

		link.href = data_type.concat(",", text_data);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});
};

update([], true);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('update').addEventListener('click', function () {
		update(get_new_data());
	});
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('close_win').addEventListener('click', closeWin)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('stop_background').addEventListener('click', stop_background)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('export_csv').addEventListener('click', export_csv)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('export_text').addEventListener('click', export_text)
});