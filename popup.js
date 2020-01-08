/**
 * Prints the title of the sample document:
 * https://docs.google.com/document/d/139SHY8E3DshWglE0S8ZWQGa3I8p-e5Id39ozHyHhItk/edit
 */


var new_date = new Date();
var hours = new_date.getHours().toString();
var minutes = new_date.getMinutes().toString();
var time = hours.concat(":", minutes) ;
const pref_csv = "file.csv";

var max_lvl = 2;
var min_lvl = 0;
var history_data = [];


function display(){
	chrome.storage.sync.get(['note_0','note_1'], function(result) {
		// get previous notes
		note_0 = result.note_0
		note_1 = result.note_1;
		document.getElementById("note_0").value = note_0;
		document.getElementById("note_1").value = note_1;
		document.getElementById("time_note").value = time;

	});
};

function update_display() {
	// update note0 = note1
	note_0 = document.getElementById("note_1").value;
	//update note1 = inpurt_note
	var new_note = '';
	var level_e = document.getElementById('level');
	var level = level_e.options[level_e.selectedIndex].value;
	
	var input_note = document.getElementById("note_input").value;
	for (var i = 0; i <= level; i++) {
		new_note = new_note.concat('  ');
	};
	note_1 = new_note.concat(time, ' ', input_note);
	//reset input note
	document.getElementById("note_input").value = "";
	//storage note to local memory
	chrome.storage.sync.set({'note_1': note_1}, function() {
          console.log('Value is set to ' + note_1);
	});
	chrome.storage.sync.set({'note_0': note_0}, function() {
          console.log('Value is set to ' + note_0);
	});
	history_data.push([time, level, input_note]);
	display();	
};
function closeWin() {
  window.close();   // Closes the new window
};
function stop_background() {
	chrome.runtime.sendMessage({type: 'stop timer run'});
};
function export_data(data_tbl, csv_file) {
	//Open previous file
	var rawFile = new XMLHttpRequest();
	var csv_data = ''
	rawFile.open("GET", csv_file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4) {
			csv_data = rawFile.responseText;
		};
	};
	rawFile.send();
	//create csv data
	for(var line of data_tbl){
		csv_data = csv_data.concat(line.join(";"), "\n");
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
};

display();


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', update_display)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('close_win').addEventListener('click', closeWin)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('stop_background').addEventListener('click', stop_background)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('export_csv').addEventListener('click', function(){
		export_data(history_data, pref_csv);
	});
});