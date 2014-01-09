(function(window, undefined) {
	var document = window.document, navigator = window.navigator, location = window.location, userAgent = navigator.userAgent,
	//[canvas name] -> canvas
	canvas_cache = {},
	//[canvas name] - > entry array
	canvas_entries = {},
	//[img name]-> Image()
	img_cache = {},
	// [[Class]] -> type pairs
	class2type = {},
	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [], core_version = "2.0.3",
	//with onmessage function
	onfireListeners = {},
	// Save a reference to some core methods
	core_concat = core_deletedIds.concat, core_push = core_deletedIds.push, core_slice = core_deletedIds.slice, core_indexOf = core_deletedIds.indexOf, core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty, core_trim = core_version.trim;

	//Teewn.js

	/**
	 * @author sole / http://soledadpenades.com
	 * @author mrdoob / http://mrdoob.com
	 * @author Robert Eisele / http://www.xarg.org
	 * @author Philippe / http://philippe.elsass.me
	 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
	 * @author Paul Lewis / http://www.aerotwist.com/
	 * @author lechecacharro
	 * @author Josh Faul / http://jocafa.com/
	 * @author egraether / http://egraether.com/
	 * @author endel / http://endel.me
	 * @author Ben Delarre / http://delarre.net
	 */

	// Date.now shim for (ahem) Internet Explo(d|r)er
	if (Date.now === undefined) {
		Date.now = function() {
			return new Date().valueOf();
		};
	}

	var TWEEN = TWEEN || (function() {
		var _tweens = [];
		return {
			REVISION : '11dev',
			getAll : function() {
				return _tweens;
			},
			removeAll : function() {
				_tweens = [];
			},
			add : function(tween) {
				_tweens.push(tween);
			},
			remove : function(tween) {
				var i = _tweens.indexOf(tween);
				if (i !== -1) {
					_tweens.splice(i, 1);
				}
			},
			update : function(time) {
				if (_tweens.length === 0)
					return false;
				var i = 0, numTweens = _tweens.length;
				time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
				while (i < numTweens) {
					if (_tweens[i].update(time)) {
						i++;
					} else {
						_tweens.splice(i, 1);
						numTweens--;
					}
				}
				return true;
			},
			size : function() {
				return _tweens.length;
			}
		};

	} )();

	TWEEN.Easing = {
		Linear : {
			None : function(k) {
				return k;
			}
		},

		Quadratic : {
			In : function(k) {
				return k * k;
			},

			Out : function(k) {
				return k * (2 - k );
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k;
				return -0.5 * (--k * (k - 2 ) - 1 );
			}
		},

		Cubic : {
			In : function(k) {
				return k * k * k;
			},

			Out : function(k) {
				return --k * k * k + 1;
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k * k;
				return 0.5 * ((k -= 2 ) * k * k + 2 );
			}
		},

		Quartic : {
			In : function(k) {
				return k * k * k * k;
			},

			Out : function(k) {
				return 1 - (--k * k * k * k );
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k * k * k;
				return -0.5 * ((k -= 2 ) * k * k * k - 2 );
			}
		},

		Quintic : {
			In : function(k) {
				return k * k * k * k * k;
			},

			Out : function(k) {
				return --k * k * k * k * k + 1;
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k * k * k * k;
				return 0.5 * ((k -= 2 ) * k * k * k * k + 2 );

			}
		},

		Sinusoidal : {
			In : function(k) {
				return 1 - Math.cos(k * Math.PI / 2);
			},

			Out : function(k) {
				return Math.sin(k * Math.PI / 2);
			},

			InOut : function(k) {
				return 0.5 * (1 - Math.cos(Math.PI * k) );
			}
		},

		Exponential : {
			In : function(k) {
				return k === 0 ? 0 : Math.pow(1024, k - 1);
			},

			Out : function(k) {
				return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
			},

			InOut : function(k) {
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if ((k *= 2 ) < 1)
					return 0.5 * Math.pow(1024, k - 1);
				return 0.5 * (-Math.pow(2, -10 * (k - 1 )) + 2 );
			}
		},

		Circular : {
			In : function(k) {
				return 1 - Math.sqrt(1 - k * k);
			},

			Out : function(k) {
				return Math.sqrt(1 - (--k * k ));
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return -0.5 * (Math.sqrt(1 - k * k) - 1);
				return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

			}
		},

		Elastic : {
			In : function(k) {
				var s, a = 0.1, p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI );
				return -(a * Math.pow(2, 10 * (k -= 1 )) * Math.sin((k - s ) * (2 * Math.PI ) / p) );

			},

			Out : function(k) {
				var s, a = 0.1, p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI );
				return (a * Math.pow(2, -10 * k) * Math.sin((k - s ) * (2 * Math.PI ) / p) + 1 );
			},

			InOut : function(k) {
				var s, a = 0.1, p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI );
				if ((k *= 2 ) < 1)
					return -0.5 * (a * Math.pow(2, 10 * (k -= 1 )) * Math.sin((k - s ) * (2 * Math.PI ) / p) );
				return a * Math.pow(2, -10 * (k -= 1 )) * Math.sin((k - s ) * (2 * Math.PI ) / p) * 0.5 + 1;

			}
		},

		Back : {
			In : function(k) {
				var s = 1.70158;
				return k * k * ((s + 1 ) * k - s );
			},

			Out : function(k) {
				var s = 1.70158;
				return --k * k * ((s + 1 ) * k + s ) + 1;
			},

			InOut : function(k) {
				var s = 1.70158 * 1.525;
				if ((k *= 2 ) < 1)
					return 0.5 * (k * k * ((s + 1 ) * k - s ) );
				return 0.5 * ((k -= 2 ) * k * ((s + 1 ) * k + s ) + 2 );

			}
		},

		Bounce : {
			In : function(k) {
				return 1 - TWEEN.Easing.Bounce.Out(1 - k);
			},

			Out : function(k) {
				if (k < (1 / 2.75 )) {
					return 7.5625 * k * k;
				} else if (k < (2 / 2.75 )) {
					return 7.5625 * (k -= (1.5 / 2.75 ) ) * k + 0.75;
				} else if (k < (2.5 / 2.75 )) {
					return 7.5625 * (k -= (2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * (k -= (2.625 / 2.75 ) ) * k + 0.984375;
				}

			},

			InOut : function(k) {
				if (k < 0.5)
					return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
				return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

			}
		}

	};

	TWEEN.Interpolation = {
		Linear : function(v, k) {
			var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.Linear;
			if (k < 0)
				return fn(v[0], v[1], f);
			if (k > 1)
				return fn(v[m], v[m - 1], m - f);
			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},

		Bezier : function(v, k) {
			var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;
			for ( i = 0; i <= n; i++) {
				b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
			}
			return b;
		},

		CatmullRom : function(v, k) {
			var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.CatmullRom;
			if (v[0] === v[m]) {
				if (k < 0)
					i = Math.floor( f = m * (1 + k ));
				return fn(v[(i - 1 + m ) % m], v[i], v[(i + 1 ) % m], v[(i + 2 ) % m], f - i);
			} else {
				if (k < 0)
					return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0] );
				if (k > 1)
					return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m] );
				return fn(v[ i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
			}
		},

		Utils : {
			Linear : function(p0, p1, t) {
				return (p1 - p0 ) * t + p0;
			},

			Bernstein : function(n, i) {
				var fc = TWEEN.Interpolation.Utils.Factorial;
				return fc(n) / fc(i) / fc(n - i);
			},

			Factorial : (function() {
				var a = [1];
				return function(n) {
					var s = 1, i;
					if (a[n])
						return a[n];
					for ( i = n; i > 1; i--)
						s *= i;
					return a[n] = s;
				};
			} )(),

			CatmullRom : function(p0, p1, p2, p3, t) {
				var v0 = (p2 - p0 ) * 0.5, v1 = (p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
				return (2 * p1 - 2 * p2 + v0 + v1 ) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
			}
		}

	};

	window.Mind = window.$ = (function() {
		var Mind = function(selector) {
			if ( typeof selector === "string") {
				if (selector.charAt(0) === "$") {
					if (selector.indexOf('@') >= 0) {
						var s = selector.split('@');
						return new Mind.fn.Entity(s[0], s[1]);
					}
					return new Mind.fn.Canvas(selector);
				} else {
					return new Mind.fn.Dom(selector);
				}
			}

			if (Mind.isFunction(selector)) {
				window.addEventListener('load', selector, false);
				return this;
			}
		};

		Mind.fn = Mind.prototype = {
			constructor : Mind,
			Dom : function(selector) {
				// Handle $(""), $(null), or $(undefined)
				if (!selector) {
					return this;
				}

				// Handle $(DOMElement)
				if (selector.nodeType) {
					this.context = this[0] = selector;
					this.length = 1;
					return this;
				}

				// Handle HTML strings,
				if ( typeof selector === "string") {
					var elem;
					if (selector.charAt(0) === "#") {
						elem = document.querySelector(selector);

					} else {
						elem = document.querySelectorAll(selector);
						//貌似有问题
					}
					if (elem) {
						this.length = elem.length;
					}
					this[0] = elem;
					//把对象放在object[0]中
					return this;
				}
			},
			Canvas : function(selector) {
				//when select canvas object like '$canvas'
				if ( selector in canvas_cache) {
					this[0] = canvas_cache[selector];
					this.context = this[0].context;
					this.id = selector;
				}
				return this;
			},
			Entity : function(context, selector) {
				//when select entity objcet like '@canvas:entity'
				var entries = canvas_entries[context];
				for (var i = 0; i < entries.length; i++) {
					var entity = entries[i];
					if (entity && entity.id === selector) {
						this[0] = entity;
						this[1] = canvas_cache[context];
						this.context = this[1].context;
						break;
					}
				}
				return this;
			},
			Animation : function(selector) {
				if ( typeof selector === 'string') {

				} else {
					this._object = selector;
					this._valuesStart = {};
					this._valuesEnd = {};
					this._valuesStartRepeat = {};
					this._duration = 1000;
					this._repeat = 0;
					this._yoyo = false;
					this._reversed = false;
					this._delayTime = 0;
					this._startTime = null;
					this._chainedTweens = [];
					this._onStartCallback = null;
					this._onStartCallbackFired = false;
					this._onUpdateCallback = null;
					this._onCompleteCallback = null;
					for (var field in selector ) {
						if (Mind.isNumeric(selector[field])) {
							this._valuesStart[field] = parseFloat(selector[field], 10);
						}
					}
					return this;
				}
			}
		};

		Mind.fn.Dom.fn = Mind.fn.Dom.prototype;
		Mind.fn.Canvas.fn = Mind.fn.Canvas.prototype;
		Mind.fn.Entity.fn = Mind.fn.Entity.prototype;
		Mind.fn.Animation.fn = Mind.fn.Animation.prototype;

		Mind.extend = Mind.fn.Dom.fn.extend = Mind.fn.Canvas.fn.extend = Mind.fn.Entity.fn.extend = Mind.fn.Animation.fn.extend = function() {
			var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !Mind.isFunction(target)) {
				target = {};
			}

			// extend Mind itself if only one argument is passed
			if (length === i) {
				target = this;
				--i;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if (( options = arguments[i]) != null) {
					// Extend the base object
					for (name in options ) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (Mind.isPlainObject(copy) || ( copyIsArray = Mind.isArray(copy)) )) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && Mind.isArray(src) ? src : [];
							} else {
								clone = src && Mind.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = Mind.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};

		Mind.extend({
			isFunction : function(obj) {
				return Mind.type(obj) === "function";
			},
			isArray : Array.isArray,
			isAndroid : function() {
				return (userAgent.toLowerCase().indexOf('android') >= 0);
			},
			isIPhone : function() {
				return (userAgent.toLowerCase().indexOf('iphone') >= 0);
			},
			isIPad : function() {
				return (userAgent.toLowerCase().indexOf('ipad') >= 0);
			},
			isWindow : function(obj) {
				return obj != null && obj === obj.window;
			},
			isNumeric : function(obj) {
				return !isNaN(parseFloat(obj)) && isFinite(obj);
			},
			type : function(obj) {
				if (obj == null) {
					return String(obj);
				}
				// Support: Safari <= 5.1 (functionish RegExp)
				return typeof obj === "object" || typeof obj === "function" ? class2type[core_toString.call(obj)] || "object" : typeof obj;
			},
			isPlainObject : function(obj) {
				// Not plain objects:
				// - Any object or value whose internal [[Class]] property is not "[object Object]"
				// - DOM nodes
				// - window
				if (Mind.type(obj) !== "object" || obj.nodeType || Mind.isWindow(obj)) {
					return false;
				}

				// Support: Firefox <20
				// The try/catch suppresses exceptions thrown when attempting to access
				// the "constructor" property of certain host objects, ie. |window.location|
				// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
				try {
					if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false;
					}
				} catch ( e ) {
					return false;
				}

				// If the function hasn't returned already, we're confident that
				// |obj| is a plain object, created by {} or constructed with new Object
				return true;
			},
			isEmptyObject : function(obj) {
				var name;
				for (name in obj ) {
					return false;
				}
				return true;
			},
			// args is for internal usage only
			each : function(obj, callback, args) {
				var value, i = 0, length = obj.length, isArray = isArraylike(obj);

				if (args) {
					if (isArray) {
						for (; i < length; i++) {
							value = callback.apply(obj[i], args);

							if (value === false) {
								break;
							}
						}
					} else {
						for (i in obj ) {
							value = callback.apply(obj[i], args);

							if (value === false) {
								break;
							}
						}
					}

					// A special, fast, case for the most common use of each
				} else {
					if (isArray) {
						for (; i < length; i++) {
							value = callback.call(obj[i], i, obj[i]);

							if (value === false) {
								break;
							}
						}
					} else {
						for (i in obj ) {
							value = callback.call(obj[i], i, obj[i]);

							if (value === false) {
								break;
							}
						}
					}
				}

				return obj;
			},
			trim : function(text) {
				return text == null ? "" : core_trim.call(text);
			},

			// results is for internal usage only
			makeArray : function(arr, results) {
				var ret = results || [];

				if (arr != null) {
					if (isArraylike(Object(arr))) {
						Mind.merge(ret, typeof arr === "string" ? [arr] : arr);
					} else {
						core_push.call(ret, arr);
					}
				}

				return ret;
			},
			merge : function(first, second) {
				var l = second.length, i = first.length, j = 0;

				if ( typeof l === "number") {
					for (; j < l; j++) {
						first[i++] = second[j];
					}
				} else {
					while (second[j] !== undefined) {
						first[i++] = second[j++];
					}
				}

				first.length = i;

				return first;
			},

			inArray : function(elem, arr, i) {
				return arr == null ? -1 : core_indexOf.call(arr, elem, i);
			},

			cacheImg : function(name, src, fn) {
				if (!( name in img_cache)) {
					var imageObject = new Image();
					if (fn && Mind.isFunction(fn)) {
						imageObject.onload = function() {
							fn();
						};
					}
					imageObject.src = src;
					img_cache[name] = imageObject;
				}
			},
		});

		// Populate the class2type map
		Mind.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

		function isArraylike(obj) {
			var length = obj.length, type = Mind.type(obj);

			if (Mind.isWindow(obj)) {
				return false;
			}

			if (obj.nodeType === 1 && length) {
				return true;
			}

			return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (length - 1 ) in obj );
		};

		Mind.fn.Dom.fn.extend({
			canvas : function(id) {
				if (id && typeof id === 'string') {
					var dom = this[0], canvas = {
						id : '$' + id,
						dom : dom,
						autoAnimation : true,
						context : dom.getContext('2d'),
						width : parseInt(dom.width),
						height : parseInt(dom.height),
						left : parseInt(dom.offsetLeft),
						top : parseInt(dom.offsetTop),
					};
				}
				canvas_cache['$' + id] = canvas;
				return new Mind.fn.Canvas('$' + id);
			}
		});

		Mind.fn.Canvas.fn.extend({
			entity : function(id, option) {
				var entries = canvas_entries[this.id] || [];
				if (id && typeof id === 'string') {
					for (var i = 0; i < entries.length; i++) {
						if (entries[i].id === id) {
							if (option) {
								entries[i] = Mind.extend(entries[i], option);
							}
							return new Mind.fn.Entity(this.id, id);
						}
					}
					//if not exist,create it
					var entity = {
						id : id,
						_hide : false,
					};
					if (option) {
						entity = Mind.extend(entity, option);
					}
					entries.push(entity);
					canvas_entries[this.id] = entries;
					return new Mind.fn.Entity(this.id, id);
				}
				return this;
			},
			height : function(h) {
				if (h) {
					this[0].dom.height = this[0].height = h;
					return this;
				} else {
					return parseInt(this[0].dom.height);
				}
			},
			width : function(w) {
				if (w) {
					this[0].dom.width = this[0].width = w;
					return this;
				} else {
					return parseInt(this[0].dom.width);
				}
			},
			erase : function(x, y,w,h) {
				var cx = x || 0 , cy = y || 0 ,cw = w || this[0].width, ch = h || this[0].height ;				
				this.context.clearRect(cx, cy, cw, ch);
				return this;
			},
			clearAll : function() {
				canvas_entries = [];
				this.context.clearRect(0, 0, this[0].width, this[0].height);
				return this;
			},
			autoAnimation : function(option) {
				//canvas will be auto refresh if autoAnimation is true;
				this[0].autoAnimation = option;
			},
			update : function() {
				if (this[0].autoAnimation) {
					this.erase();
					var entries = canvas_entries[this.id];
					//	console.log(entries);
					for (var i = 0; entries && i < entries.length; i++) {
						new Mind.fn.Entity(this.id, entries[i].id).draw();
					}
				}
				return this;
			}
		});

		Mind.fn.Entity.fn.extend({
			draw : function() {
				var option = this[0] || {};
				if (option._hide) {
					return;
				}
				
				if(option._onDraw){
					option._onDraw();
				}
				this.context.save();
				if ('translateX' in option && 'translateY' in option) {
					this.context.translate(option.translateX, option.translateY);
				}
				if ('rotate' in option) {
					this.context.rotate(option.rotate);
				}
				if ('scaleX' in option && 'scaleY' in option) {
					this.context.scale(option.scaleX, option.scaleY);
				}
				if ('draw' in option && Mind.isFunction(option.draw)) {//可以自带flush方法
					option.draw.call(this);
				} else {
					if (option.type === 'image') {
						var img = option.res;
						if ( typeof img === 'string') {
							img = img_cache[option.res];
						}
						if (!img) {
							return this;
						}
						if (('sx' in option) && ('sy' in option) && ('sw' in option) && ('sh' in option) && ('dx' in option) && ('dy' in option) && ('dw' in option) && ('dh' in option)) {
							this.context.drawImage(img, option.sx, option.sy, option.sw, option.sh, option.dx, option.dy, option.dw, option.dh);
						} else if (('dx' in option) && ('dy' in option) && ('dw' in option) && ('dh' in option)) {
							this.context.drawImage(img, option.dx, option.dy, option.dw, option.dh);
						} else {
							this.context.drawImage(img, option.dx, option.dy);
						}
					}
				}
				this.context.restore();
				
				if(option._onDrawComplete){
					option._onDrawComplete();
				}
				return this;
			},
			animation : function() {
				return new Mind.fn.Animation(this[0]);
			},
			hide : function() {
				this[0]._hide = true;
				if (TWEEN.size() === 0) {
					Mind(this[1].id).update();
				}
				return this;
			},
			show : function() {
				this[0]._hide = false;
				if (TWEEN.size() === 0) {
					Mind(this[1].id).update();
				}
				return this;
			},
			bind : function(eventTag, fn, isPropagation) {
				var events = onfireListeners[eventTag] || [], isPropagation = isPropagation || false;
				events.unshift({
					data : this[0],
					canvas_id : this[1].id,
					fn : fn,
					isPropagation : isPropagation,
				});
				onfireListeners[eventTag] = events;
				return this;
			},
			unbind : function(eventTag, fn) {
				if (!fn) {
					onfireListeners[eventTag] = [];
				} else {
					var events = onfireListeners[eventTag] || [];
					var newEvents = [];
					for (var i = 0; i < events.length; i++) {
						if (!(events[i].fn == fn && events[i].data.name == this[0].name)) {
							newEvents.push(events[i]);
						}
					}
					onfireListeners[eventTag] = newEvents;
				}
				return this;
			},
			listen : function(event,fn){
				if(!this[0]._fireListeners){
					this[0]._fireListeners = {};
				}
				if(!this[0]._fireListeners[event]){
					this[0]._fireListeners[event] = [];
				}
				
				this[0]._fireListeners[event].push(fn);
				return this;
			},
			onfire : function(){
				console.log(arguments);
				var event = arguments[0],
				events = this[0]._fireListeners[event],
				args = [];
				for(var i=1;i<arguments.length;i++){
					args[args.length] = arguments[i];
				}
				if(events){
					for(var i = 0;i<events.length;i++){
						events[i].apply(this,args);
					}
				}
			},
			inzone : function() {
				var x = arguments[0], y = arguments[1];
				if (Mind.isFunction(x)) {
					this[0]._isInZone = fn;
					return this;
				} else {
					if (this[0]._isInZone) {
						return this[0]._isInZone.call(this, x, y);
					} else {
						var shape = this[0].shape || 'rect', w = this[0].dw || this[0].w || 0, h = this[0].dh || this[0].h || 0, dx = this[0].translateX ? this[0].translateX + this[0].dx : this[0].dx, dy = this[0].translateY ? this[0].translateY + this[0].dy : this[0].dy;

						if (shape === 'rect') {
							//console.log(this[0]);
							//console.log("x:" + x + ":y:" + y + "|dx:" + dx + ":dy" + dy + "|w:" + w + ":h:" + h);
							if (x > dx && y > dy && x < dx + w && y < dy + h) {
								return true;
							}
						} else if (shape === 'circle') {
							var r = e.data.r || 0, cx = dx + r, cy = dy + r, dist = Math.sqrt(Math.pow(Math.abs(cx - x), 2) + Math.pow(Math.abs(cy - y), 2));

							if (dist < r) {
								return true
							}
						}
						return false;
					}
				}
			},
			click : function(fn, isPropagation) {
				this.bind(_touchstart, function(x, y) {
					if (!this.onfireTime) {
						this.onfireTime = (new Date()).valueOf();
					} else {
						if ((new Date()).valueOf() - this.onfireTime < 300) {
							fn.call(this,x, y);
						} else {
							this.onfireTime = (new Date()).valueOf();
						}
					}
				}, isPropagation);
				return this;
			},
			touchmove : function(fn, isPropagation) {
				this.bind(_touchmove, fn, isPropagation);
				return this;
			},
			tap : function(fn, isPropagation) {
				this.bind(_touchstart, fn, isPropagation);
				return this;
			},
			longtap : function(fn, interval, isPropagation) {
				this[0]._onTap = false;
				this.bind(_touchend, function(x, y) {
					this._onTap = false;
				}, isPropagation);
				this.bind(_touchstart, function(x, y) {
					this._onTap = true;
					var data = this;
					setTimeout(function() {
						if (data._onTap) {
							fn.call(this, x, y);
						}
						data._onTap = false;
					}, interval);
				}, isPropagation);
				return this;
			},
			remove : function() {
				var entities = canvas_entries[this[1].id] || [];
				for (var i = 0; i < entities.length; i++) {
					if (entities[i] == this[0]) {
						entities.splice(i, 1);
						if (TWEEN.size() === 0) {
							Mind(this[1].id).update();
						}
					}
				}
				return this;
			},
			up : function() {
				var entities = canvas_entries[this[1].id] || [];
				for (var i = 0; i < entities.length; i++) {
					if (entities[i].id === this[0].id) {
						entities.push(entities.splice(i, 1)[0]);
						if (TWEEN.size() === 0) {
							Mind(this[1].id).update();
						}
						return this;
					}
				}
				return this;
			},
			down : function() {
				var entities = canvas_entries[this[1].id] || [];
				for (var i = 0; i < entities.length; i++) {
					if (entities[i].id === this[0].id) {
						entities.unshift(entities.splice(i, 1)[0]);
						if (TWEEN.size() === 0) {
							Mind(this[1].id).update();
						}
						return this;
					}
				}
				return this;
			},
			shape : function(fn) {
				var option = this[0] || {};
				option.type = 'shape';
				if (fn && Mind.isFunction(fn)) {
					option.draw = fn;
				}
				return this;
			},
			translate : function(x, y) {
				var option = this[0] || {};
				option.translateX = x;
				option.translateY = y;
				return this;
			},
			rotate : function(angle) {
				var option = this[0] || {};
				option.rotate = (Math.PI / 180) * angle;
				return this;
			},
			scale : function(x, y) {
				var option = this[0] || {};
				option.scaleX = x;
				option.scaleY = y;
				return this;
			},
			res : function(res) {
				var option = this[0] || {};
				if ( typeof res === 'string') {
					option.res = img_cache[res];
				}
				option.type = 'image';
				return this;
			},
			data : function(key,value){
				if(key && value){
					this[0][key] = value;
					return this;
				}else{ 
					if(key){
						return this[0][key];
					}else{
						return this[0];
					}
				}
			},
			onDraw : function(callback){
				this[0]._onDraw = callback;
			},
			onDrawComplete : function(callback){
				this[0]._onDrawComplete = callback;
			},
			canvas : function(){
				console.log(this[1].id);
				return Mind(this[1].id);
			}
		});

		Mind.fn.Animation.fn.extend({
			_interpolationFunction : TWEEN.Interpolation.Linear,
			_easingFunction : TWEEN.Easing.Linear.None,
			to : function(properties, duration) {
				if (duration !== undefined) {
					this._duration = duration;
				}
				this._valuesEnd = properties;
				return this;
			},
			start : function(time) {
				TWEEN.add(this);
				this._onStartCallbackFired = false;
				this._startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
				this._startTime += this._delayTime;
				for (var property in this._valuesEnd ) {
					// check if an Array was provided as property value
					if (this._valuesEnd[property] instanceof Array) {
						if (this._valuesEnd[property].length === 0) {
							continue;
						}
						// create a local copy of the Array with the start value at the front
						this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

					}
					this._valuesStart[property] = this._object[property];
					if ((this._valuesStart[property] instanceof Array ) === false) {
						this._valuesStart[property] *= 1.0;
						// Ensures we're using numbers, not strings
					}
					this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
				}
				return this;
			},

			stop : function() {
				TWEEN.remove(this);
				return this;
			},

			delay : function(amount) {
				this._delayTime = amount;
				return this;
			},

			repeat : function(times) {
				this._repeat = times;
				return this;
			},
			yoyo : function(yoyo) {
				this._yoyo = yoyo;
				return this;
			},
			easing : function(easing) {
				this._easingFunction = easing;
				return this;
			},
			interpolation : function(interpolation) {
				this._interpolationFunction = interpolation;
				return this;
			},
			chain : function() {
				this._chainedTweens = arguments;
				return this;
			},
			onStart : function(callback) {
				this._onStartCallback = callback;
				return this;
			},
			onUpdate : function(callback) {
				this._onUpdateCallback = callback;
				return this;
			},
			onComplete : function(callback) {
				this._onCompleteCallback = callback;
				return this;
			},
			update : function(time) {
				var property;
				if (time < this._startTime) {
					return true;
				}

				if (this._onStartCallbackFired === false) {
					if (this._onStartCallback !== null) {
						this._onStartCallback.call(this._object);
					}
					this._onStartCallbackFired = true;
				}

				var elapsed = (time - this._startTime ) / this._duration;
				elapsed = elapsed > 1 ? 1 : elapsed;

				var value = this._easingFunction(elapsed);

				for (property in this._valuesEnd ) {
					var start = this._valuesStart[property] || 0;
					var end = this._valuesEnd[property];
					if ( end instanceof Array) {
						this._object[property] = this._interpolationFunction(end, value);
					} else {
						// Parses relative end values with start as base (e.g.: +10, -3)
						if ( typeof (end) === "string") {
							end = start + parseFloat(end, 10);
						}
						// protect against non numeric properties.
						if ( typeof (end) === "number") {
							this._object[property] = start + (end - start ) * value;
						}

					}

				}

				if (this._onUpdateCallback !== null) {
					this._onUpdateCallback.call(this._object, value);
				}

				if (elapsed == 1) {
					if (this._repeat > 0) {
						if (isFinite(this._repeat)) {
							this._repeat--;
						}
						// reassign starting values, restart by making startTime = now
						for (property in this._valuesStartRepeat ) {
							if ( typeof (this._valuesEnd[property] ) === "string") {
								this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10);
							}
							if (this._yoyo) {
								var tmp = this._valuesStartRepeat[property];
								this._valuesStartRepeat[property] = this._valuesEnd[property];
								this._valuesEnd[property] = tmp;
								this._reversed = !this._reversed;
							}
							this._valuesStart[property] = this._valuesStartRepeat[property];
						}
						this._startTime = time + this._delayTime;
						return true;
					} else {
						if (this._onCompleteCallback !== null) {
							this._onCompleteCallback.call(this._object);
						}
						for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
							this._chainedTweens[i].start(time);
						}
						return false;
					}
				}
				return true;
			}
		});

		return Mind;
	})();

	Mind.Easing = TWEEN.Easing;

	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	})();

	function animate() {
		requestAnimationFrame(animate);
		if (TWEEN.update()) {
			refresh();
		}
	}

	function refresh() {
		for (var id in canvas_cache) {
			Mind(id).update();
		}
	}

	function onfire(name, event) {
		var target = Mind.isAndroid() ? event.changedTouches[0] : event, x = target.pageX, y = target.pageY, listeners = onfireListeners[name];
		if (listeners) {
			for (var i = 0; i < listeners.length; i++) {
				var e = listeners[i], canvas = canvas_cache[e.canvas_id], tx = x - canvas.left, ty = y - canvas.top,entity = Mind(e.canvas_id).entity(e.data.id);
				if (entity.inzone(tx,ty)) {
					e.fn.call(entity, tx, ty);
					if (!e.isPropagation) {
						break;
					}
				}
			}
		}
	}

	var _touchstart = (Mind.isAndroid() ? 'touchstart' : 'mousedown');
	var _touchend = (Mind.isAndroid() ? 'touchend' : 'mouseup');
	var _touchmove = (Mind.isAndroid() ? 'touchmove' : 'mousemove');
	window.addEventListener(_touchstart, function(event) {
		onfire(_touchstart, event);
	}, false);

	window.addEventListener(_touchend, function(event) {
		onfire(_touchend, event);
	}, false);

	window.addEventListener(_touchmove, function(event) {
		onfire(_touchmove, event);
	}, false);

	animate();
})(window);

