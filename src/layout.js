Mind.fn.Canvas.fn.extend({
	left : function(val){
		if(typeof val === "string"){
			var reg = new RegExp("%$");
			if(reg.test(val)){
				return Math.round(this.width() * parseFloat(val)/100);
			}
		}else{
			return parseFloat(val);
		}
	},
	right : function(val){
		if(typeof val === "string"){
			var reg = new RegExp("%$");
			if(reg.test(val)){
				return Math.round(this.width() * (1-parseFloat(val)/100));
			}
		}else{
			return parseFloat(val);
		}
	},
	top : function(val){
		if(typeof val === "string"){
			var reg = new RegExp("%$");
			if(reg.test(val)){
				return Math.round(this.height() * parseFloat(val)/100);
			}
		}else{
			return parseFloat(val);
		}
	},
	bottom : function(val){
		if(typeof val === "string"){
			var reg = new RegExp("%$");
			if(reg.test(val)){
				return Math.round(this.height() * (1-parseFloat(val)/100));
			}
		}else{
			return parseFloat(val);
		}
	},	
});