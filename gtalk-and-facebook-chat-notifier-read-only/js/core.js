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

/** Javascript file of core function */


var chatNotifier = {

	options: {},

	cptFacebook : 0,

	loadChatNotifier: function() {

		debugMsg(logLevels.info, "Load Chat Notifier" );

		function loadOptions(callback) {
			chrome.extension.sendRequest(
					{action : 'getOptions'},
					function(result) {
						options = result;
						debugMsg(logLevels.info, "Load option : " + options.activateFacebook + ' ' +  options.activateGtalk );
						if(callback) callback();
					}
			);
		}

		function onRequest(request, sender, sendResponse) {
			if (request.action == 'optionsChanged') {
				this.options = request.options;
				debugMsg(logLevels.info, "Receive option : " + this.options.activateFacebook + ' ' + this.options.activateGtalk );
				ini();
			}
		}


		function iniFacebook(){
			if( $('#fbDockChatTabs').length == 0 ){ // We are waiting for the chat to be loaded
				setTimeout(iniFacebook, 1000);
			}else{
				setTimeout(function(){
					chatNotifier.cptFacebook = $('#fbDockChatTabs .fbDockChatTab').length;
					document.addEventListener('DOMSubtreeModified',chatNotifier.updateFacebook,false);
					debugMsg(logLevels.info, "Extension activate for facebook" );
				}, 5000);
			}
		}

		function iniGtalk(){
			document.addEventListener('DOMSubtreeModified',chatNotifier.updateGtalk,false);
			debugMsg(logLevels.info, "Extension activate for gtalk" );
		}

		function ini(){
			if ( document.getElementById("blueBar") != null && (this.options.activateFacebook) ){
				// This is Facebook
				debugMsg(logLevels.info, "New facebook page, waiting to launch extension" );
				chrome.extension.sendRequest(
					{action : 'newFacebook'},
					iniFacebook
				);
			}

			if ( document.getElementById("canvas_frame") != null && (this.options.activateGtalk) ){
				// This is Gmail
				debugMsg(logLevels.info, "New gmail page, waiting to launch extension" );
				chrome.extension.sendRequest(
					{action : 'newGTalk'},
					iniGtalk
				);
			}
		}

		loadOptions(ini);
		chrome.extension.onRequest.addListener(onRequest);

	},

	showNotification: function(type, el, texte){
		chrome.extension.sendRequest(
			{
				action : 'notify',
				type:type,
				texte:texte
			},
			function(result) {

				// The notification has been closed

				// Unmark the notified flag
				el.Notified = false;

				switch(result){
					case 0:
						break;

					case 1:
						// Mouse event to mark the message as read
						//~ var evt = document.createEvent("MouseEvents");
						//~ evt.initMouseEvent("mouseup", true, true, window, 0, 0, 100, 100, 0, false, false, false, false, 0, null);
						//~ el.dispatchEvent(evt);

						$(el).removeClass('Hz highlight');

						break;

					default:
						debugMsg(logLevels.error, "Receive undefined callback from notification. result : " + result );
				}
			}
		);
	},

	updateGtalk: function(){
		if(options.activateGtalk){

			debugMsg(logLevels.info, "Update Gtalk");

			// Un Hz apparait en cas de message en attente...
			$('.Hz').each(function(index, el){

				debugMsg(logLevels.info, "Update Gtalk element");

				if( $(this).text().trim() != "..." && (el.Notified == undefined || el.Notified == false)  ){

					debugMsg(logLevels.info, "Update Gtalk element 2");

					// Mark the element as notified
					el.Notified = true;

					// Name of the sender
					name = $(this).text().trim();
					debugMsg(logLevels.info, "Name of sender : " + name );

					// Message sent ../next nh/ .ko / last .km
					$el_message = $('div.km:last [dir=ltr]:not(.kn):last',$(this).parent());
					message = $el_message.text();
					debugMsg(logLevels.info, "Message : " + message );

					if( $el_message.get(0).Notified == undefined || $el_message.get(0).Notified == false ){

						// Mark the message as notified
						//$el_message.get(0).Notified = true;

						chatNotifier.showNotification( "gtalk", el, name + ' : ' + message);

					}else{
						// Unmark the element as notified, we did nothing
						el.Notified = false;
					}
				}

			});
		}
	},

	updateFacebook: function(){
		if(options.activateFacebook){

			debugMsg(logLevels.info, "Update Facebook");

			$('div.highlight').each(function(index, el){

				debugMsg(logLevels.info, "Update Facebook element");

				if( el.Notified == undefined || el.Notified == false ){

					debugMsg(logLevels.info, "Update Facebook element 2");

					// Mark the element as notified
					el.Notified = true;

					// Name of the sender
					name = $('div.name', $(this)).text().trim();
					debugMsg(logLevels.info, "Name of sender : " + name );


					chatNotifier.showNotification( "facebook", el, name );

					// Mouse event to make facebook load the last message
					//$('.fbNub').trigger( 'click' );
					//$(el).trigger( 'click' );

					//$test = $('.fbChatMessage',$(this));
					//alert('Size: ' + $test.length + ' ' + $test.get($test.length-1).innerText );
					//message = $('.fbChatConvItem:last .messages:last  .fbChatMessage:last',$(this)).text();
					/*
					// Message sent
					$el_message = $('.fbChatMessage:last',$(this));
					message = $el_message.text();
					debugMsg(logLevels.info, "Message : " + message );

					if( $el_message.get(0)!=undefined && ($el_message.get(0).Notified == undefined || $el_message.get(0).Notified == false ) ){

						// Mark the element as notified
						//$el_message.get(0).Notified = true;

						chatNotifier.showNotification( "facebook", el, name );

					}else{
						// Unmark the element as notified, we did nothing
						el.Notified = false;
					}
					*/
				}

			});

			debugMsg(logLevels.info, "Length : " + $('#fbDockChatTabs .fbDockChatTab').length+ ' '+ chatNotifier.cptFacebook);
			if( $('#fbDockChatTabs .fbDockChatTab').length != chatNotifier.cptFacebook ){
				tmp = chatNotifier.cptFacebook; // Use tmp to be fast and replace value now in order to avoid double notification
				chatNotifier.cptFacebook = $('#fbDockChatTabs .fbDockChatTab').length;

				if( $('#fbDockChatTabs .fbDockChatTab').length > tmp ){
					// Nouvelle tab

					// Name of the sender
					name = $('div.name', $('#fbDockChatTabs .fbDockChatTab:eq(0)')[0]).text().trim();
					debugMsg(logLevels.info, "Name of sender : " + name +' (New Window)');

					chatNotifier.showNotification( "facebookNew", $('#fbDockChatTabs .fbDockChatTab:eq(0)')[0], name );

				}

			}

		}
	}

};

chatNotifier.loadChatNotifier();
