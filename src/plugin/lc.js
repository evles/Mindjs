/**
 * @author Alex Wu
 */
(function() {
	$.extend({
		_remoteEventListeners : {}, //with onmessage function
		addRemoteEventListener : function(eventTag, fn) {
			if ( eventTag in this._remoteEventListeners) {
				this._remoteEventListeners[eventTag].push(fn);
			} else {
				this._remoteEventListeners[eventTag] = [fn];
			}
		},
		lc : {
			notify : function(w, data) {
				if (webClient) {
					if (w === 'all') {
						webClient.postAll(JSON.stringify(data));
					}
				}
			},
			players : function() {
				if (webClient) {
					return webClient.getPlayers();
				}
			},
			self : function() {
				if (webClient) {
					return webClient.getSelf();
				}
			},
			getBackward : function() {
				if (webClient) {
					return webClient.getBackward();
				}
			},
			getForward : function() {
				if (webClient) {
					return webClient.getForward();
				}
			},
			userCount : function() {
				if (webClient) {
					return parseInt(webClient.getPlayNum());
				}
			},
			setRequestedOrientation : function(requestedOrientation) {
				//参数：-1：跟随系统
				//  0：强制横屏
				//  1：强制竖屏
				if (webClient) {
					webClient.setRequestedOrientation(requestedOrientation);
				}
			},
			shake : function(time) {//unit ms
				if (webClient) {
					webClient.shake(time);
				}
			},
			width : function() {
				if (webClient) {
					return webClient.getScreenW();
				}
			},
			height : function() {
				if (webClient) {
					return webClient.getScreenH();
				}
			},
			ready : function() {
				if (webClient) {
					webClient.getReady();
				}
			}
		},
	});

	window.lcmessage = function(msg) {
		var data = msg, onFireEvents = $._remoteEventListeners[data.eventTag];
		for (var i = 0; onFireEvents && i < onFireEvents.length; i++) {
			onFireEvents[i](data);
		}
	};
})();
