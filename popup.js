var SCRIPT_ID='13_C_0Gu_zFhxX_w_ktHEqu77U2neAf-qHurtZU2XWh6pObvPeQagpJ0-'; // Apps Script script id
/*

 */
function update_display(history_data){
	if(!history_data){
		return;
	}
	var history_text = '';
	for (var i=history_data.length-1;i>=0; i--) {
		history_text = history_text.concat(create_text(history_data[i]));
	}
	// get previous notes
	document.getElementById("history_note").value = history_text;
	// update time display
	var new_date = new Date();
	var hours = new_date.getHours().toString();
	var minutes = new_date.getMinutes().toString();
	document.getElementById("date").value = new_date.toISOString().substr(0, 19).replace(/T.*/, ' ');
	document.getElementById("time_note").value = hours.concat(":", minutes);
	//reset input note
	document.getElementById("note_input").value = "";
	document.getElementById("outcome_input").value = "";
}

function create_text(data) {
	var text_data = '';
	var whiteSpace = '';
	var obj_time = get_obj_value(data, 'time') || 'NA';
	var value = get_obj_value(data, 'value') || '';
	//var outcome = get_obj_value(data, 'outcome') || '';
	text_data = text_data.concat(obj_time,':');
	text_data = text_data.concat(value, '\n');
	text_data = whiteSpace + text_data.split('\n').join(whiteSpace + '\n') ;
	return text_data;
}
function get_obj_value(obj, key){
	if(typeof(obj)==='object' && key in obj){
		return obj[key]
	} else {
		return false
	}
}

function get_storage() {
	return new Promise(function(resolve, reject) {
		chrome.storage.local.get(['history_data'], function(result) {
			if('history_data' in result){
				resolve(result.history_data);
			} else {
				resolve([]);
			}
		});
	});
}
/* write new noteinput to storage */
function update(data, display_only=false){
	get_storage().then(function(value) {
		if(!display_only) {
			value.push(data);
		}
		update_display(value);		
		chrome.storage.local.set({'history_data': value});
    });
}

function get_new_date() {
	//get new note value
	var input_note = document.getElementById("note_input").value;
	var outcome = document.getElementById("outcome_input").value;
	var time = document.getElementById("time_note").value;
	var date = document.getElementById("date").value;
	//storage note to local memory
	var new_date = {'value':input_note, 'outcome':outcome, 'time':time, 'date': date};
	return new_date;
}
function closeWin() {
	document.getElementById("info").textContent = '';//TODO: empty info
  	window.close();   // Closes the new window
  	return null;
}

function export_csv() {
	get_storage().then(function(data_tbl) {
		var csv_data = 'data:text/csv,';
		var cur_date = '';
		var create_file = false;
		var file_name = '';
		//create csv data
		while(data_tbl.length > 0){
			if(cur_date===data_tbl[0]['date']){
				line = data_tbl.shift();
				csv_data = csv_data.concat(line['time'],';');
				csv_data = csv_data.concat(line['value'],';', '\n');
				if(data_tbl.length===0) {
					create_file = true;
					file_name = cur_date.concat('.csv');
				}
			} else {
				if (cur_date!==''){
					create_file = true;
					file_name = cur_date.concat('.csv');										
				}
				cur_date = data_tbl[0]['date'];
			}
			
			if (create_file){
				//creative new log file
				export_file(csv_data, file_name);
				csv_data = 'data:text/csv,';
				create_file = false;			
			}
		}
	});
}

function export_text() {
	get_storage().then(function(data_tbl) {
		var text_data = 'data:text,';
		var cur_date = '';
		var create_file = false;
		var file_name = '';
		//creative new log file
		while(data_tbl.length > 0){
			if(cur_date===data_tbl[0]['date']){
				line = data_tbl.shift();
				text_data = text_data.concat(create_text(line));
				if(data_tbl.length===0) {
					create_file = true;
					file_name = cur_date.concat('.txt');
				}
			} else {
				if (cur_date!==''){
					create_file = true;
					file_name = cur_date.concat('.txt');										
				}
				cur_date = data_tbl[0]['date'];
			}
			if (create_file){
				alert(file_name);
				//creative new log file
				export_file(text_data, file_name);
				text_data = 'data:text,';
				create_file = false;			
			}
		}
	});
}

function export_file(data,file_name) {
	var link = document.createElement("a");
	link.textContent = "Save as TEXT";
	link.download = file_name;
	link.href = data;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function write_tempo() {
    //console.log("Write tempo");
	sendDataToExecutionAPI();
}

/**
 * Make an authenticated HTTP POST request.
 *
 * @param {object} options
 *   @value {string} url - URL to make the request to. Must be whitelisted in manifest.json
 *   @value {object} request - Execution API request object
 *   @value {string} token - Google access_token to authenticate request with.
 *   @value {function} callback - Function to receive response.
 */
function post(options) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {

		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if(xhr.readyState === 4 && xhr.status !== 200) {
			//sampleSupport.log('post', xhr.readyState, xhr.status, xhr.responseText);
		}
	}
	xhr.open('POST', options.url, true);
	// Set standard Google APIs authentication header.
	xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
	xhr.send(JSON.stringify(options.request));
}

/**
 * Calling the Execution API script.
 */
function sendDataToExecutionAPI() {
	//disableButton(xhr_button);
	//xhr_button.className = 'loading';
	getAuthToken({
		'interactive': true,
		'callback': sendDataToExecutionAPICallback,
	});
}

/**
 * Calling the Execution API script callback.
 * @param {string} token - Google access_token to authenticate request with.
 */
function sendDataToExecutionAPICallback(token) {
	var new_note = get_new_date();
	post({	'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {'function': 'main',
			'parameters': new_note
		}
	});
}
/**
 * Handling response from the Execution API script.
 * @param {Object} response - response object from API call
 */
function executionAPIResponse(response){
	if (response.done){
		document.getElementById("info").textContent = 'Notes has entered tempo 5000';
		update(get_new_date());
		setTimeout(closeWin, 500);
	} else {
		document.getElementById("info").textContent = 'Error...';
	}
	//exec_result.innerHTML = info;
}

/**
 * Get users access_token.
 *
 * @param {object} options
 *   @value {boolean} interactive - If user is not authorized ext, should auth UI be displayed.
 *   @value {function} callback - Async function to receive getAuthToken result.
 */
function getAuthToken(options) {
	chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}
/**
 * Revoking the access token.
 */
function revokeToken() {
	exec_result.innerHTML='';
	getAuthToken({
		'interactive': false,
		'callback': revokeAuthTokenCallback,
	});
}

/**
 * Revoking the access token callback
 */
function revokeAuthTokenCallback(current_token) {
	if (!chrome.runtime.lastError) {

		// Remove the local cached token
		chrome.identity.removeCachedAuthToken({ token: current_token }, function() {});

		// Make a request to revoke token in the server
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
			current_token);
		xhr.send();

		// Update the user interface accordingly
		// changeState(STATE_START);
		/*sampleSupport.log('Token revoked and removed from cache. '+
			'Check chrome://identity-internals to confirm.');*/
	}

}

update([], true);

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('export_csv').addEventListener('click', export_csv);
	document.getElementById('export_text').addEventListener('click', export_text);
	document.getElementById("note_input").addEventListener("keypress",function() {
		//console.log("keyp");
		//when input 'enter'
		if(event.keyCode == 13){
			if (event.shiftKey){
				//newline
				document.getElementById("note_input").value += '\n';
			} else {
				console.log("key");
				// if note is not empty
				if(document.getElementById("note_input").value) {
					event.preventDefault();
					write_tempo();//push note
				}
			}
		}
	});
	document.getElementById("outcome_input").addEventListener("keypress",function() {
		//when input 'enter'
		if(event.keyCode == 13){
			if (event.shiftKey){
				//newline
				document.getElementById("outcome_input").value += '\n';
			} else {
				// if note is not empty
				if(document.getElementById("note_input").value) {
					event.preventDefault();
					write_tempo();//push note
				}
			}
		}
	});
	document.getElementById("timer").addEventListener("keypress",function() {
		// Handle key press
		var key = event.keyCode;
		key = String.fromCharCode(key);
		var regex = /[0-9]/;
		if( !regex.test(key) ) {
		event.returnValue = false;
		if(event.preventDefault) event.preventDefault();
		}
	});
});



