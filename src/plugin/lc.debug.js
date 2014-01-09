/**
 * @author Yue Lv
 */
// browser checked
$.extend({
	_remoteEventListeners : {},
	_consoleListeners : {}, //?
	addRemoteEventListener : function(eventTag, fn) {
		if (eventTag in this._remoteEventListeners) {
			this._remoteEventListeners[eventTag].push(fn);//把事件放入队列
		} else {
			this._remoteEventListeners[eventTag] = [ fn ];
		}
	},
	addConsoleListeners : function(eventTag, fn) {
		if (eventTag in this._consoleListeners) {
			this._consoleListeners[eventTag].push(fn);
		} else {
			this._consoleListeners[eventTag] = [ fn ];
		}
	},
	lc : {
		_source: null,
		_players : [],
		_self : {},
		_backward : null,
		_forward : null,
		_playerNum : 0,
		notify : function(w, data) {
			if (w === 'all') {
				var postData = {
					action : "postall",
					from : $.lc._self,
					data : data
				};
				this._source.postMessage(JSON.stringify(postData), '*');
			}
		},
		players : function() {
			$.debug.log($.lc._self.name + "获取所有玩家列表");
			return this._players;
		},
		self : function() {
			$.debug.log($.lc._self.name + "获取个人信息");
			return this._self;
		},
		getBackward : function() {
			$.debug.log($.lc._self.name + "获取下一个玩家为"+$.lc._backward.name);
			return this._backward;
		},
		getForward : function() {
			$.debug.log($.lc._self.name + "获取上一个玩家为"+$.lc._backward.name);
			return this._forward;
		},
		userCount : function() {
			$.debug.log($.lc._self.name + "玩家个数为"+$.lc._playerNum);
			return this._playerNum;
		},
		setRequestedOrientation : function(requestedOrientation) {
			// 参数：-1：跟随系统
			// 0：强制横屏
			// 1：强制竖屏
			var msg = '';
			if(requestedOrientation == -1){
				msg = '跟随系统';
			}
			
			if(requestedOrientation == 0){
				msg = '强制横屏';
			}
			
			if(requestedOrientation == 1){
				msg = '强制竖屏';
			}
			$.debug.log($.lc._self.name + "设置屏幕为" + msg);
		},
		shake : function(time) {
			$.debug.log($.lc._self.name + "将持续" + time + "的震动");
		},
		width : function() {
			return 480;
		},
		height : function() {
			return 800;
		},
		ready : function() {
			if ($.lc._source) {//?
				var postData = {
					action : 'ready',
					from : $.lc._self,
				};
				$.lc._source.postMessage(JSON.stringify(postData),'*');
			} else {
				setTimeout(function() {
					$.lc.ready();
				}, 500);
			}
		}
	},
	debug : {
		log : function(log){
			var postData = {
				action : 'log',
				from : $.lc._self,
				data :  log,
			};
			$.lc._source.postMessage(JSON.stringify(postData), '*');
		},
		close : function(){
			var postData = {
				action : 'close',
				from : $.lc._self,
			};
			$.lc._source.postMessage(JSON.stringify(postData), '*');
		}
	}
});

(function() {
	$.addConsoleListeners('reg',function(data){//监听注册事件
		$.lc._players = data.players;
		$.lc._self = data.self;
		$.lc._backward = data.backward;
		$.lc._forward = data.forward;
		$.lc._playerNum = data.playNum;
		
		$.debug.log($.lc._self.name+": register success.");
	});
	
	$.addConsoleListeners('onready',function(data){//？？
		if(window.lconready){
			window.lconready();
			$.debug.log($.lc._self.name+": onready fired.");
		}
	});
	
	$.addConsoleListeners('lcmessage',function(data){
		if(window.lcmessage){
			window.lcmessage(data);
			$.debug.log($.lc._self.name+": lcmessage fired.");
		}
	});
	
	window.addEventListener('message', function(event){ 
		if(!$.lc._source){
			$.lc._source = event.source;
		}
		var data =JSON.parse(event.data), onFireEvents = $._consoleListeners[data.action];
		for ( var i = 0; onFireEvents && i < onFireEvents.length; i++) {
			onFireEvents[i](data.data);
		}
	},false);


	// 窗体关闭,通知通知主窗体。
	window.addEventListener('unload', function(){
		$.debug.close();
	}, false);
	
	window.lcmessage = function(msg) {//执行相应事件绑定的事件函数
		var data = msg, onFireEvents = $._remoteEventListeners[data.eventTag];
		for ( var i = 0; onFireEvents && i < onFireEvents.length; i++) {
			onFireEvents[i](data);
		}
	};
})();