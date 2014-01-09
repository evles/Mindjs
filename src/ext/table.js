/**
 * @author Administrator
 */
Mind.fn.Entity.fn.extend({
	table : function(column, row) {
		this.data('column', column);
		this.data('row', row);
		this.shape(function() {
			var dx = this.data('dx'), 
			dy = this.data('dy'), 
			w = this.data('w'), 
			h = this.data('h'), 
			c = this.data('column'), 
			r = this.data('row'),
			fillcolors = ['#999', '#eee'],
			points = [];
			
			//画横线
			for (var i = 0; i <= c; i++) {
				var x1 = dx, y1 = dy + i * (h/r), x2 = dx + w;
				points[points.length] = [x1, y1, x2, y1];
			}
			
			//画竖线
			for (var i = 0; i <= r; i++) {
				var tx1 = dx + i * (w/c), ty1 = dy, ty2 = dy + h;
				points[points.length] = [tx1, ty1, tx1, ty2];
			}
			this.canvas().line(points);
		});
		
		this.tap(function(x,y){
			var dx = this.data('dx'), 
			dy = this.data('dy'), 
			w = this.data('w'), 
			h = this.data('h'), 
			c = this.data('column'), 
			r = this.data('row'),
			cw = w/c,
			cr = h/r;
			
			if(x > dx && y > dy){
				var column = Math.ceil((x-dx)/cw),
				row = Math.ceil((y-dy)/cr),
				crossX = Math.ceil((x-dx+0.5*cw)/cw),
				crossY = Math.ceil((y-dy+0.5*cr)/cr);
				
				this.onfire("oncell",column,row);
				this.onfire("oncross",crossX,crossY);
			}
		});
		
		return this;
	}
});
