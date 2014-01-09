Mind.fn.Canvas.fn.extend({
	line : function(points, style) {
		style = style || {};
		style.width = style.width || 2, style.color = style.color || '#000';

		this.context.strokeStyle = style.color;
		this.context.lineWidth = style.width;

		this.context.beginPath();
		if (!$.isArray(points[0])) {//说明是点集合
			points = [points];
		}

		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			this.context.moveTo(p[0], p[1]);
			this.context.lineTo(p[2], p[3]);
		}
		this.context.closePath();
		this.context.stroke();
	},
	rect : function(x1, y1, x2, y2, style) {
		style = style || {};
		style.width = style.width || 2, style.color = style.color || '#000',style.fillcolor = style.fillcolor|| '#666';

		var ctx = this.context;
		ctx.fillStyle = style.fillcolor;
		ctx.strokeStyle = style.color;
		ctx.lineWidth = style.width;
		console.log(style.width);
		if (style.shadowWidth) {
			ctx.shadowBlur = style.shadowWidth;
			ctx.shadowColor = style.shadowColor || "#000";
			ctx.shadowOffsetX = style.shadowX || 5;
			ctx.shadowOffsetY = style.shadowY || 5;
		}
		if (style.r) {
			ctx.beginPath();
			ctx.moveTo(x1 + style.r, y1);
			ctx.lineTo(x2 - style.r, y1);
			ctx.arc(x2 - style.r, y1 + style.r, style.r, 3 * Math.PI / 2, 2 * Math.PI, false);
			ctx.lineTo(x2, y2 - style.r);
			ctx.arc(x2 - style.r, y2 - style.r, style.r, 0, Math.PI / 2, false);
			ctx.lineTo(x1 + style.r, y2);
			ctx.arc(x1 + style.r, y2 - style.r, style.r, Math.PI / 2, Math.PI, false);
			ctx.lineTo(x1, y1 + style.r);
			ctx.arc(x1 + style.r, y1 + style.r, style.r, Math.PI, 3 * Math.PI / 2, false);
			ctx.closePath();
			if (style.fillcolor) {
				ctx.fill();
			}
			ctx.stroke();
		} else {
			if (style.fillcolor) {
				ctx.fillRect(x1, y1, Math.abs(x2 - x1), Math.abs(y2 - y1));
				// 画出矩形并使用颜色填充矩形区域
			}
			ctx.strokeRect(x1, y1, Math.abs(x2 - x1), Math.abs(y2 - y1));
			// 只勾画出矩形的外框
		}
	},
	arc : function(x, y, r, startDegree, endDegree, style) {
		style = style || {};
		style.width = style.width || 0, style.color = style.color || '#000',style.fillcolor = style.fillcolor|| '#666';

		var ctx = this.context;
		if(style.fillcolor){
			ctx.fillStyle = style.fillcolor;
		}
		ctx.strokeStyle = style.color;
		ctx.lineWidth = style.width;

		if (style.shadowWidth) {
			ctx.shadowBlur = style.shadowWidth;
			ctx.shadowColor = style.shadowColor || "#000";
			ctx.shadowOffsetX = style.shadowX || 5;
			ctx.shadowOffsetY = style.shadowY || 5;
		}

		var sarc = startDegree * (Math.PI / 180);
		var earc = endDegree * (Math.PI / 180);
		ctx.beginPath();
		ctx.arc(x, y, r, sarc, earc);
		// 从 -1/4π 到 3/4π, 以 (230, 90) 为圆心, 半径 60px 画圆.
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	},
	polygon : function(points, style) {
		style = style || {};
		style.width = style.width || 2, style.color = style.color || '#000',style.fillcolor = style.fillcolor|| '#666';

		var ctx = this.context;
		ctx.fillStyle = style.fillcolor;
		ctx.strokeStyle = style.color;
		ctx.lineWidth = style.width;

		if (style.shadowWidth) {
			ctx.shadowBlur = style.shadowWidth;
			ctx.shadowColor = style.shadowColor || "#000";
			ctx.shadowOffsetX = style.shadowX || 5;
			ctx.shadowOffsetY = style.shadowY || 5;
		}

		ctx.beginPath();
		if ($.isArray(points[0]) && points.length > 2) {//说明是点集合
			ctx.moveTo(points[0][0], points[0][1]);
			for (var i = 1; i < points.length; i++) {
				var p = points[i];
				ctx.lineTo(p[0], p[1]);
			}
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	},
	text : function(x, y, text,style) {
		if (style.shadowWidth) {
			ctx.shadowBlur = style.shadowWidth;
			ctx.shadowColor = style.shadowColor || "#000";
			ctx.shadowOffsetX = style.shadowX || 5;
			ctx.shadowOffsetY = style.shadowY || 5;
		}

		style.size = style.size || 24;
		style.font = style.font || 'Georgia';
		this.context.fillStyle = style.fillcolor || '#000';
		this.context.font =  style.size + "px "+ style.font;
		this.context.fillText(text, x, y);
	},
});
