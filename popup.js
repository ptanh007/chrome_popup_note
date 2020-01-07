/**
 * Prints the title of the sample document:
 * https://docs.google.com/document/d/139SHY8E3DshWglE0S8ZWQGa3I8p-e5Id39ozHyHhItk/edit
 */

var note_0 = '';
var note_1 = '';
var new_date = new Date();
var hours = new_date.getHours();
var minutes = new_date.getMinutes();
var max_lvl = 2;
var min_lvl = 0;
var level = min_lvl;
var time_list = [];

function create_time_stept(stept, max_lvl, hours, minutes){
	var times_list = []
	for (var i = 0; i <= max_lvl; i++) {
		minutes = minutes + 5*i;
		if(minutes>60){
			minutes = minutes - 60;
			hours = hours + 1;
		};
		if(hours>24){
			hours = hours -24;
		};
		times_list[i] = hours.toString().concat(':', minutes);
	};
	return times_list
};
function display(){
	chrome.storage.local.get(['note_0','note_1'], function(result) {
		// get previous notes
		note_0 = result.note_0
		note_1 = result.note_1;
		document.getElementById("note_0").value = note_0;
		document.getElementById("note_1").value = note_1;
		document.getElementById("time_note").value = time_list[level];
		document.getElementById("level").value = level;
	});
};

function update_display() {
	// update note0 = note1
	note_0 = document.getElementById("note_1").value;
	//update note1 = inpurt_note
	var new_note = ''
	for (var i = 0; i <= max_lvl; i++) {
		new_note = new_note.concat('');
	};
	note_1 = new_note.concat(time_list[level], ' ', document.getElementById("note_input").value);
	//reset input note
	document.getElementById("note_input").value = "";
	//storage note to local memory
	chrome.storage.local.set({'note_1': note_1}, function() {
          console.log('Value is set to ' + note_1);
	});
	chrome.storage.local.set({'note_0': note_0}, function() {
          console.log('Value is set to ' + note_0);
	});
	display();	
};
function increase_lvl() {
	if(level<max_lvl){
		level = level +1;
	};
	document.getElementById("time_note").value = time_list[level];
	document.getElementById("level").value = level;
};
function decrease_lvl() {
	if(level>min_lvl){
		level = level -1;
	};
	document.getElementById("time_note").value = time_list[level];
	document.getElementById("level").value = level;
};
function closeWin() {
  window.close();   // Closes the new window
};
function stop_background() {
	clearTimeout();
};

time_list = create_time_stept(5, max_lvl, hours, minutes);
display();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', update_display)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('incr_lvl').addEventListener('click', increase_lvl)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('decre_lvl').addEventListener('click', decrease_lvl)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('close_win').addEventListener('click', closeWin)
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('stop_background').addEventListener('click', stop_background)
});