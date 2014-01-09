/**
 * @author Wuliang
 */
$.fn.Dom.fn.extend({
	show : function() {
		if(!this[0]) {
			return;
		}
		if(Mind.isArray(this[0])) {
			var elems = this[0];
			for(var i = 0; i < elems.length; i++) {
				Mind(elems[i]).show();
			}
		} else {
			this[0].style.display = 'block';
		}
	},
	hide : function() {
		if(!this[0]) {
			return;
		}
		if(Mind.isArray(this[0])) {
			var elems = this[0];
			for(var i = 0; i < elems.length; i++) {
				Mind(elems[i]).hide();
			}
		} else {
			this[0].style.display = 'none';
		}
	},
	css : function(name, value) {
		if(name && value && this[0]) {
			if(Mind.isArray(this[0])) {
				var elems = this[0];
				for(var i = 0; i < elems.length; i++) {
					Mind(elems[i]).css(name, value);
				}
			} else {
				this[0].style[name] = value;
			}
		}
	},
	addClass : function(name) {
		if(!this[0]) {
			return;
		}

		if(Mind.isArray(this[0])) {
			var elems = this[0];
			for(var i = 0; i < elems.length; i++) {
				Mind(elems[i]).addClass(name);
			}
		} else {
			var el = this[0].classList;
			el.add(name);
		}
	},
	removeClass : function(name) {
		if(!this[0]) {
			return;
		}

		if(Mind.isArray(this[0])) {
			var elems = this[0];
			for(var i = 0; i < elems.length; i++) {
				Mind(elems[i]).removeClass(name);
			}
		} else {
			var el = this[0].classList;
			el.remove(name);
		}
	},
	toggleClass : function(name) {
		if(!this[0]) {
			return;
		}

		if(Mind.isArray(this[0])) {
			var elems = this[0];
			for(var i = 0; i < elems.length; i++) {
				Mind(elems[i]).toggleClass(name);
			}
		} else {
			var el = this[0].classList;
			el.toggle(name);
		}
	},
	hasClass : function(name, value) {
		if(!this[0]) {
			return;
		}
		if(!Mind.isArray(this[0])) {
			var el = this[0].classList;
			return el.contains(name);
		}
	},
	html : function() {
		if(!this[0]) {
			return;
		}
		var value = arguments[0];
		if(!Mind.isArray(this[0])) {
			if(value!=undefined){
				this[0].innerHTML = value;
			}else{
				return this[0].innerHTML;
			}			
		}
	},
	append : function(html){
		if(!this[0] || !html) {
			return;
		}
		
		if(typeof html == 'string'){
			var node = document.createElement("div");
			node.innerHTML = html;
			var childs = node.childNodes;
			for(var i=0;i<childs.length;i++){
				this.append(childs[i]);
			}
		}else{
			this[0].appendChild(html);
		}
	},
	remove : function(){
		if(!this[0]){
			return;
		}
		
		this[0].parentNode.removeChild(this[0]);
	}
});
