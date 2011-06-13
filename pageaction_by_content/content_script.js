/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var fin="Finished:"
function testForBuild()
{
	var spinner=document.getElementById('spinner');
	var tmp=document.getElementById("out");
	if(spinner==null)
	{
		return true;
	}
	else
	{
			return false;
	}
	/* if(window.find(fin))
	{
	//alert("'");
	return true;
	}
	else
	{
	return false;
} */
}

test();

function test()
{
	// Test the text of the body element against our regular expression.
	if(testForBuild()) {
	  // The regular expression produced a match, so notify the background page.
	  //chrome.extension.sendRequest({}, function(response) {});
		//alert("building");
		//
		//alert("Build Finished");
		request=true;
		console.log("building done");
		chrome.extension.sendRequest(request);
	  } 
else{	  
	  setTimeout("location.reload(true)",100);
		console.log("building");
	  
	 } //chrome.extension.sendRequest({}, function(response) {});
	
}
