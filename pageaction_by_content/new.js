
function testBuild()
{
		if(request1!=true)
		{
		//alert("'");
		//console.log("req!=true");
		
		setTimeout("testBuild1()",1000);
		//sleep(5000);
		}
		if(request1==true)
		{
		//console.log("req==true");
		var notification = webkitNotifications.createNotification('B&R.png', 'success','Build Successfull');
		notification.show();
		}
				
}
function testBuild1()
{
var tab.url=getUrl(sender.tab.url);
	   if (xhr) {
					xhr.abort();
				}
				xhr = new XMLHttpRequest();
				//window.clearTimeout(abortTimer);
				//abortTimer = window.setTimeout(xhr.abort, REQUEST_TIMEOUT);
				try {
					xhr.onreadystatechange = checkResponse;
					//xhr.onerror = handleError;
					xhr.open('GET', tab.url + 'api/json', true);
					if (typeof auth == 'string') {
						xhr.setRequestHeader('Authorization', 'Basic ' + auth);
					}
					xhr.send();
				} catch (e) {
					//handleError(e);
				}

 //alert(sender.tab.url);
 //request1=true;
 }

 function getUrl(Url)
 {
 alert("d");
 var pos=Url.lastIndexOf("console");
 alert(pos);
 if(pos==-1)
 return ""
 else
 return Url.slice(0,pos);
 
 }
 
 
function checkResponse() {
				 if (xhr.readyState != 4) return;
				
				/*if (xhr.status == 200 && xhr.responseText) {
					var response = JSON.parse(xhr.responseText);
					var topStatus = -1;
					if (response.jobs) {
						jobs = response.jobs;
						if (localStorage.sorting == 'status') {
							jobs.sort(sortByStatus);
						} else {
							jobs.sort(sortByName);
						}
						for (var i in response.jobs)
							topStatus = Math.max(topStatus, STATUSES[response.jobs[i].color]);
					}
					//handleSuccess(topStatus);
					return;
				} else {
					//handleError(xhr.status != 200 ? 'HTTP ' + xhr.status : 'No responseText found');
					return;
				} */
			}		