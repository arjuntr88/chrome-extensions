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

/** Javascript file for the option */


var options;

function getMilliseconds(ctrl) {
	var value = parseFloat(ctrl.val());
	value = isNaN(value) ? 0 : value * 1000;
	ctrl.val(value / 1000);
	return value;
}

function saveOptions() {

	this.preventDefault;

	options.activateGtalk = $('#activateGtalk:checkbox')[0].checked;
	options.activateFacebook = $('#activateFacebook:checkbox')[0].checked;

	options.timeout = $('#timeout:checkbox')[0].checked;
	options.timeoutValue = getMilliseconds($('#timeoutValue'));

	localStorage.options = JSON.stringify(options);
	enableControls(false);
	sendOptions(options);
	restoreOptions();

	saveConfirm();

  //chrome.extension.getBackgroundPage().init();
}

function restoreOptions() {
	options = loadOptions();

	$('#activateGtalk:checkbox')[0].checked = options.activateGtalk;
	$('#activateFacebook:checkbox')[0].checked = options.activateFacebook;

	$('#timeout:checkbox')[0].checked = options.timeout;
	$('#timeoutValue').val((options.timeoutValue || 0) / 1000);

	enableControls(false);
	enableTimeoutInput();
}

// Saves options to localStorage.
function save_options(optionName, value) {
	localStorage[optionName] = value;
}

// get options from localStorage.
function get_options(optionName) {
	return localStorage[optionName];
}

function saveConfirm() {
	// Update status to let user know options were saved.
	$('#status').text(chrome.i18n.getMessage('saved'));
	$('#status').clearQueue().fadeIn(100).delay(10000).fadeOut(600);
}

function enableControls(enabled) {
	enabled = enabled || false;
	$('button').attr('disabled', !enabled);
}

function enableTimeoutInput() {
	$('input#timeoutValue').attr('disabled', !$('#timeout:checkbox')[0].checked );
	if(!$('#timeout:checkbox')[0].checked)
		$('.timeOutBlock').addClass('grey');
	else
		$('.timeOutBlock').removeClass('grey');
}

function onRequest(request, sender, callback) {
	switch(request.action) {
		case 'optionsChanged':
			restoreOptions();
			break;
	}
}

$(function() {

	$('#status').clearQueue().hide();

	$('input, select, textarea').change(enableControls).keydown(enableControls);
	$('input#timeout').change(enableTimeoutInput).keydown(enableTimeoutInput);

	$('#save-button').click(saveOptions);
	$('#cancel-button').click(restoreOptions);



	//$('#tabs').tabs({ selected: 0 });

	restoreOptions();
	chrome.extension.onRequest.addListener(onRequest);
});

