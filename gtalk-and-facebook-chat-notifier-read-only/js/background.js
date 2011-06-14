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

 /** Javascript file of for background function */

/** Page action gestion */
function showPageAction(tabId, changeInfo, tab) {
	if (tab.url.match('mail.google.com') ){
		if (this.options.activateGtalk)
			chrome.pageAction.setIcon({tabId: tab.id, path: chrome.extension.getURL("/icons/gtalk_16.png")});
		else
			chrome.pageAction.setIcon({tabId: tab.id, path: chrome.extension.getURL("/icons/gtalk_grey_16.png")});
		chrome.pageAction.show(tab.id);
	}

	if (tab.url.match('www.facebook.com')){
		if (this.options.activateFacebook)
			chrome.pageAction.setIcon({tabId: tab.id, path: chrome.extension.getURL("/icons/facebook_16.png")});
		else
			chrome.pageAction.setIcon({tabId: tab.id, path: chrome.extension.getURL("/icons/facebook_grey_16.png")});
		chrome.pageAction.show(tab.id);


		//setTimeout(function(){
			//Arbiter.subscribe(PresenceMessage.getArbiterMessageType('msg'),this._updateFacebook.bind(this));
			//chrome.extension.sendRequest({action : 'loadFacebook'});
			//chrome.tabs.executeScript(tab.id, {file: "/js/facebook.js"});
		//}, 9000);

	}
}

/** Update page action in case of desactivation/activation of the extension in pages */
function updatePageAction(){

	chrome.windows.getAll(null, function (windows) {
		for (var i=0; i<windows.length; i++) {
			chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
				for (var j=0; j<tabs.length; j++) {
					showPageAction(tabs[j].id, '', tabs[j]);
				}
			});
		}
	});

}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(showPageAction);

/***** Tab gestion *****/
var currentTabFacebook = -1;
var currentTabGtalk = -1;

var arrayTabFacebook = new Array();
var arrayTabGtalk = new Array();
/*
chrome.tabs.onCreated.addListener(function(tab){

	if (tab.url.match('mail.google.com') ){
		arrayTabGtalk.push(tab.id);
	}

	if (tab.url.match('www.facebook.com')){
		arrayTabFacebook.push(tab.id);
	}
});
*/
chrome.tabs.onRemoved.addListener(function(tabId){
	debugMsg(logLevels.error, "Tab removed event caught. tab #" + tabId);

	arrayTabGtalk.filter(function(el){return el.id!=tabId;});
	arrayTabFacebook.filter(function(el){return el.id!=tabId;});

	switch(tabId){
		case currentTabFacebook:
			var e = arrayTabFacebook.pop();
			if( e != null ){
				e.callback();
				currentTabFacebook = e.id;
			}else{
				currentTabFacebook = -1;
			}
			debugMsg(logLevels.error, "Current facebook extension page closed, fallback on tab #" + currentTabFacebook);
			break;

		case currentTabGtalk:
			var e = arrayTabGtalk.pop();
			if( e != null ){
				e.callback();
				currentTabGtalk = e.id;
			}else{
				currentTabGtalk = -1;
			}
			debugMsg(logLevels.error, "Current gmail extension page closed, fallback on tab #" + currentTabGtalk);
			break;
	}
});

function newFacebook(id, callback){
	if( currentTabFacebook == -1 || currentTabFacebook == id){
		// if the extension is not active in any facebook page or if this is the actual (reload of page)
		callback();
		currentTabFacebook = id;
	}else{
		arrayTabFacebook.push({'id':id,'callback':callback});
	}
}

function newGtalk(id, callback){
	if( currentTabGtalk == -1 || currentTabGtalk == id){
		// if the extension is not active in any gtalk page or if this is the actual (reload of page)
		callback();
		currentTabGtalk = id;

	}else{
		arrayTabGtalk.push({'id':id,'callback':callback});
	}
}


// Performs an ajax GET request
function ajaxGet(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				callback(xhr.responseText);
			} else {
				callback(null);
			}
		}
	}
	xhr.open('GET', url, true);
	xhr.send();
};

/** Method to display a notification */
function showNotification(type, texte, callback ){

	switch( type ){

		case 'gtalk' :
			title = "gtalkNotificationTitle";
			logo = "/icons/gtalk_48.png";
			break;
		case 'facebookNew' :
			title = "facebookNotificationTitle";
			logo = "/icons/facebook_48.png";
			texte = chrome.i18n.getMessage("textNotificationNew") + ' ' + texte;
			break;
		case 'facebook' :
			title = "facebookNotificationTitle";
			logo = "/icons/facebook_48.png";
			texte = chrome.i18n.getMessage("textNotification") + ' ' + texte;
			break;
	}

	try {

		// Simple Notification Window
		var notification = window.webkitNotifications.createNotification(
			chrome.extension.getURL(logo),
			chrome.i18n.getMessage(title),
			texte
		);
		// HTML notification:
		//var notification = webkitNotifications.createHTMLNotification('notification.html');

		notification.onclose = function() {
			callback(1);
		};
		notification.show();

		debugMsg(logLevels.info, "Timeout : "+options.timeout + " Value : "+ options.timeoutValue);
		if(options.timeout){
			callback(1);
			setTimeout(function(){
				notification.cancel();
			}, options.timeoutValue);
		}

	}catch (err) {
		debugMsg(logLevels.error, "Notification right error, ask for permission. "+err);
		window.webkitNotifications.requestPermission();
	}

}

function onRequest(request, sender, callback) {

	debugMsg(logLevels.info, "Request : " + request.action);

	switch(request.action) {
		case 'ajaxGet':
			ajaxGet(request.url, callback);
			break;
		case 'getOptions':
			console.log('callback');
			callback(options);
			break;
		case 'optionsChanged':
			options = request.options;
			updatePageAction();
			break;
		case 'saveOptions':
			localStorage.options = JSON.stringify(request.options);
			sendOptions(request.options);
			break;
		case 'notify':
			showNotification(request.type, request.texte, callback);
			break;
		case 'loadFacebook':

			break;
		case 'newFacebook':
			newFacebook(sender.tab.id, callback);
			break;
		case 'newGTalk':
			newGtalk(sender.tab.id, callback);
			break;
		default :
			debugMsg(logLevels.error, "Unknow request "+ request);
	}
};




// Load options
options = loadOptions();

// Bind events
chrome.extension.onRequest.addListener(onRequest);

