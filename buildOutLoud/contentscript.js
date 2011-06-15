/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var regex = /hudson/;
function testForHudson() {
	var header = document.getElementById('header');
	if (header == null)
		return false;
	for (i = 0; header.rows[i] != null; i++) {
		for (j = 0; header.rows[i].cells[j] != null; j++) {
			if (regex.test(header.rows[i].cells[j].innerHTML))
				return true;
		}
	}
	
	return false;
}

// Test the text of the body element against our regular expression.
if (testForHudson()) {
	// The regular expression produced a match, so notify the background page.
	chrome.extension.sendRequest({}, function (response) {});
	
} else {
	// No match was found.
}
 