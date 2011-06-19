/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var hudson = /hudson/;
var jenkins = /Jenkins/;
var title = /Dashboard/;
function testForHudson() {
	var header = document.getElementById('header');
	if (header == null)
		return false;
	for (i = 0; header.rows[i] != null; i++) {
		for (j = 0; header.rows[i].cells[j] != null; j++) {
			if (hudson.test(header.rows[i].cells[j].innerHTML) || jenkins.test(header.rows[i].cells[j].innerHTML))
				return true;
		}
	}
	
	return false;
}

// Test the text of the body element against our regular expression.
if (testForHudson()) {
	if(title.test(document.title))
	{
	response="root";
	chrome.extension.sendRequest(response);
	}// The regular expression produced a match, so notify the background page.
	chrome.extension.sendRequest({}, function (response) {});
	
} else {
	// No match was found.
}
 