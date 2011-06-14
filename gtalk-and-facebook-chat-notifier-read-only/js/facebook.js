/*
function ChatNotif(a,b,d,e,c){this.parent.construct(this,a,b,d,d,e,c);}

//ChatGroupTab.extend('ChatTab');
ChatNotif.extend('ChatTab');
ChatNotif.prototype={
	newMsg:function(a){
		this.parent.newMsg(a);
	}
};

		Arbiter.subscribe(c,this._handlePresenceMessage.bind(this));

Arbiter.subscribe(PresenceMessage.getArbiterMessageType('msg'),this._updateGroupCounts.bind(this));
*/HTML('<span class="test" style="visibility:hidden">Test</span>')
//DOM.appendContent(document.body,HTML('<span class="test" style="visibility:hidden">Test</span>'));
//$N('span',{className:'UISelectList_Item'})
var chatNotifier = {

	ini: function(){
		Arbiter.subscribe(PresenceMessage.getArbiterMessageType('msg'),this._updateFacebook.bind(this));
	},

	_updateFacebook: function(k,a){
		var e=a.obj;
		var c=e.from;
		var o=e.to;
		var p=e.type;
		var i=e.msg;
		var n=i.time;
		//$('body').append('<span class="data" style="visibility:hidden">'+a.type + ' ' + c + ' ' + o + ' ' + p + ' ' + i+'</span>');
		//chatNotifier.showNotification( "facebook", null, a.type + ' ' + c + ' ' + o + ' ' + p + ' ' + i );
	}
};

chatNotifier.ini();

