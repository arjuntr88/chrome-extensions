/**
 * Copyright (c) 2010 Aurélien Chabot
 * Licensed under the GNU General Public License v3, read LICENSE
 *
 * This file is part of Gtalk & Facebook Chat Extension.
 *
 * "Gtalk & Facebook Chat Extension" is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * "Gtalk & Facebook Chat Extension" is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with "Gtalk & Facebook Chat Extention".
 * If not, see <http://www.gnu.org/licenses/>.
 */

/** Javascript file of some common function */


function loadOptions() {
	var options;
	if (localStorage.options == null)
		localStorage.options = '{}';

	options = JSON.parse(localStorage.options);

	options.activateGtalk = 		options.hasOwnProperty('activateGtalk') ? options.activateGtalk : true;
	options.activateFacebook = 		options.hasOwnProperty('activateFacebook') ? options.activateFacebook : true;

	options.timeout = 				options.hasOwnProperty('timeout') ? options.timeout : true;
	options.timeoutValue = 			options.hasOwnProperty('timeoutValue') ? options.timeoutValue : 5000;

	debugMsg(logLevels.info, 'TimeOut : '+options.timeout);
	debugMsg(logLevels.info, 'TimeOut Value : '+options.timeoutValue);
	debugMsg(logLevels.info, 'activateGtalk Value : '+options.activateGtalk);
	debugMsg(logLevels.info, 'activateFacebook Value : '+options.activateFacebook);

	localStorage.options = JSON.stringify(options);

	return options;
}

// Send options to all tabs and extension pages
function sendOptions(options) {
	var request = {action: 'optionsChanged', 'options': options};

	// Send options to all tabs
	chrome.windows.getAll(null, function (windows) {
		for (var i=0; i<windows.length; i++) {
			chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
				for (var j=0; j<tabs.length; j++) {
					chrome.tabs.sendRequest(tabs[j].id, request);
				}
			});
		}
	});

	// Send options to other extension pages
	chrome.extension.sendRequest(request);
}

// Send options to all tabs and extension pages
function saveCommonOptions(options) {
	var request = {action: 'saveOptions', 'options': options};

	// Send options to other extension pages
	chrome.extension.sendRequest(request);
}
