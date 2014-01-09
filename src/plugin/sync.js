var SyncArray = function() {
	var x = Array.apply(null, arguments);
	for (var p in x)
	this[p] = x[p];
	this.length = x.length;
}, syncVal = function(prop, oldval, val) {
	console.log("prop:" + prop + "-&gt;oldval:" + oldval + "-&gt;val:" + val);
}, syncArray = function(type, arr) {
	console.log('type:' + type);
	console.log(arr);
};
SyncArray.prototype = new Array();
SyncArray.prototype.constructor = SyncArray;
SyncArray.prototype.push = function() {
	Array.prototype.push.apply(this, arguments);
	syncArray('push', this);
};
SyncArray.prototype.pop = function() {
	Array.prototype.pop.apply(this, arguments);
	syncArray('pop', this);
};
(function() {
	Mind.extend({
		sync : function(obj) {
			if ($.type(obj) === 'object') {
				for (var name in obj) {
					obj.watch(name, syncVal);
					if ($.type(obj[name]) === 'object') {
						$.sync(obj[name]);
					}
				}
			}
		}
	});
})();
