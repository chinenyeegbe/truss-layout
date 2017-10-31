(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("truss", [], factory);
	else if(typeof exports === 'object')
		exports["truss"] = factory();
	else
		root["truss"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/sumitpal/work/dev/truss-layout/implementation";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = undefined;
	
	var _manager = __webpack_require__(1);
	
	var _manager2 = _interopRequireDefault(_manager);
	
	var _utils = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var layout = function () {
	    var attachEvent = document.attachEvent;
	    var isIE = navigator.userAgent.match(/Trident/);
	    var requestFrame = function () {
	        var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
	            return window.setTimeout(fn, 20);
	        };
	        return function (fn) {
	            return raf(fn);
	        };
	    }();
	
	    var cancelFrame = function () {
	        var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
	        return function (id) {
	            return cancel(id);
	        };
	    }();
	
	    function resizeListener(e) {
	        var win = e.target || e.srcElement;
	        if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
	        win.__resizeRAF__ = requestFrame(function () {
	            var trigger = win.__resizeTrigger__;
	            trigger.__resizeListeners__.forEach(function (fn) {
	                fn.call(trigger, e);
	            });
	        });
	    }
	
	    function objectLoad() {
	        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
	        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
	    }
	
	    var addResizeListener = function addResizeListener(element, fn) {
	        if (!element.__resizeListeners__) {
	            element.__resizeListeners__ = [];
	            if (attachEvent) {
	                element.__resizeTrigger__ = element;
	                element.attachEvent('onresize', resizeListener);
	            } else {
	                if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
	                var obj = element.__resizeTrigger__ = document.createElement('object');
	                obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
	                obj.__resizeElement__ = element;
	                obj.onload = objectLoad;
	                obj.type = 'text/html';
	                if (isIE) element.appendChild(obj);
	                obj.data = 'about:blank';
	                if (!isIE) element.appendChild(obj);
	            }
	        }
	        element.__resizeListeners__.push(fn);
	    };
	
	    var removeResizeListener = function removeResizeListener(element, fn) {
	        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
	        if (!element.__resizeListeners__.length) {
	            if (attachEvent) element.detachEvent('onresize', resizeListener);else {
	                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
	                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
	            }
	        }
	    };
	
	    return {
	        addEvent: addResizeListener,
	        removeEvent: removeResizeListener
	    };
	}();
	// export  TrussLayout;
	function _init(_conf) {
	    var elem = document.createElement('div'),
	        instance = void 0,
	        conf = {},
	        configuration = parseConfig(_conf || {}),
	        _parent = configuration.container;
	    // set element height and width
	    elem.style.height = '100%';
	    elem.style.width = '100%';
	    //elem.style.margin = '5px';
	    elem.style.position = 'relative';
	    elem.id = 'trussLayoutContainer';
	
	    if (configuration.enableContainerDrag) {
	        var startX = void 0,
	            startY = void 0,
	            startWidth = void 0,
	            startHeight = void 0,
	            initDrag = function initDrag(e) {
	            startX = e.clientX;
	            startY = e.clientY;
	            startWidth = parseInt(document.defaultView.getComputedStyle(elem).width, 10);
	            startHeight = parseInt(document.defaultView.getComputedStyle(elem).height, 10);
	            document.documentElement.addEventListener('mousemove', doDrag, false);
	            document.documentElement.addEventListener('mouseup', stopDrag, false);
	        },
	            doDrag = function doDrag(e) {
	            elem.style.width = startWidth + e.clientX - startX + 'px';
	            elem.style.height = startHeight + e.clientY - startY + 'px';
	        },
	            stopDrag = function stopDrag() {
	            document.documentElement.removeEventListener('mousemove', doDrag, false);
	            document.documentElement.removeEventListener('mouseup', stopDrag, false);
	        },
	            resizerStyle = {
	            width: '7px',
	            height: '7px',
	            background: 'blue',
	            position: 'absolute',
	            right: '0',
	            bottom: '0',
	            borderRadius: '50% 0 0 0',
	            cursor: 'se-resize'
	        };
	
	        elem.addEventListener('click', function init() {
	            elem.removeEventListener('click', init, false);
	            elem.className = elem.className + ' resizable';
	            var resizer = document.createElement('div');
	            // resizer.className = 'resizer';
	            (0, _utils._addStyle)(resizer, resizerStyle);
	
	            elem.appendChild(resizer);
	            resizer.addEventListener('mousedown', initDrag, false);
	        }, false);
	
	        layout.addEvent(elem, function (e) {
	            var newHeight = e.target.innerHeight,
	                newWidth = e.target.innerWidth,
	                ch = conf.height - newHeight,
	                cw = conf.width - newWidth;
	
	            instance.resizeLayout(ch ? -1 * ch : 0, cw ? -1 * cw : 0);
	            conf.height = newHeight;
	            conf.width = newWidth;
	        });
	    }
	
	    _parent.appendChild(elem);
	    // creating instance of truss layout
	    instance = new _manager2.default(elem);
	    instance.setConfigaration(configuration);
	
	    conf.height = elem.offsetHeight;
	    conf.width = elem.offsetWidth;
	
	    return instance;
	}
	
	function parseConfig(conf) {
	    var config = {
	        background: '#ccc',
	        containerBackground: '#fff',
	        sliderBackground: '#F2F2F2',
	        sliderHoverColor: '#d7dcea',
	        buttonTextColor: '#fff',
	        buttonBackgroung: '#4679BD',
	        container: document.getElementsByTagName('body')[0],
	        enableContainerDrag: true
	    },
	        temp = {};
	
	    // user config merged with the default config
	    for (var i in config) {
	        if (conf.hasOwnProperty(i)) {
	            temp[i] = conf[i];
	        } else {
	            temp[i] = config[i];
	        }
	    }
	
	    return temp;
	}
	
	exports.init = _init;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _grid = __webpack_require__(2);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	var _utils = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TrussLayout = function () {
		function TrussLayout(elem) {
			_classCallCheck(this, TrussLayout);
	
			this.gridList = {};
			this.elementCounter = 0;
			this.parent = elem;
			this.gridCount = {};
		}
	
		_createClass(TrussLayout, [{
			key: 'config',
			value: function config() {
				return {
					margin: 5,
					padding: 0
				};
			}
		}, {
			key: 'getAllGrids',
			value: function getAllGrids() {
				return this.gridList;
			}
		}, {
			key: 'setConfigaration',
			value: function setConfigaration(conf) {
				this.configuration = conf;
				return this;
			}
		}, {
			key: 'getConfiguration',
			value: function getConfiguration() {
				return this.configuration;
			}
		}, {
			key: 'resizeLayout',
			value: function resizeLayout(heightChange, widthChange) {
				var rows = this.gridCount.rows,
				    cols = this.gridCount.columns,
				    ch = heightChange / rows,
				    cw = widthChange / cols,
				    list = this.gridList,
				    conf = this.gridCount,
				    vertical = 0;
	
				// iterating through all the sliders
				for (var i = 0, ii = this.slider.length; i < ii; i++) {
					var _slider = this.slider[i],
					    isVertical = _slider.isVertical,
					    elem = _slider.slider;
	
					if (isVertical) {
						vertical++;
						var //ic = (Math.abs(conf['columns'] - 2 - Number(i)) + 1),
						left = cw * vertical;
	
						left = parseFloat(elem.style.left) + left;
						// logic for changinf the left position
						elem.style.left = left + 'px';
						// logic for changing the height
						elem.style.height = parseFloat(elem.style.height) + heightChange + 'px';
						// changing slider current position
						_slider.currX && (_slider.currX = left);
					} else {
						var numberOfCells = isVertical ? conf['rows'] : conf['columns'];
						// logic for changing the top
						var top = ch + ch * i;
						top = parseFloat(elem.style.top) + top;
						elem.style.top = top + 'px';
						// changing the current top position of the slider
						_slider.currY && (_slider.currY = top);
						// LOGIC for changing the width
						var width = cw * numberOfCells;
						elem.style.width = parseFloat(elem.style.width) + width + 'px';
					}
				}
	
				for (var _i in list) {
					var node = list[_i].getNode(),
					    layout = list[_i].splitLayout;
	
					node.style.height = parseFloat(node.style.height) + ch + 'px';
					node.style.width = parseFloat(node.style.width) + cw + 'px';
					list[_i].resizeContainer();
					layout && layout.resizeLayout(ch, cw);
				}
			}
		}, {
			key: '_removeAllGrids',
			value: function _removeAllGrids() {
				for (var i in this.gridList) {
					this.parent.removeChild(this.gridList[i].getNode());
				}
				this.elementList = {};
				this.elementCounter = 0;
			}
			/**
	   * set child node property that defines the amount that the grids can be shifted. This function also
	   * stores the configuration to its parent manager (root node).
	   * @param {Number} h - height of the grids
	   * @param {Number} w - width of the grids
	   * @param {Number} r - number of rows
	   * @param {Number} c - number of columns
	   */
	
		}, {
			key: 'setDraggableDimension',
			value: function setDraggableDimension(h, w, r, c) {
				var parentManager = this.parentManager,
				    gridConf = this.gridConf = {
					hMax: h / 2,
					hSum: h / 2 * r,
					wMax: w / 2,
					wSum: w / 2 * c
				};
				if (parentManager) {
					parentManager.gridConfCollection || (parentManager.gridConfCollection = {});
					parentManager.gridConfCollection[this.index] = gridConf;
				}
			}
		}, {
			key: 'getMinimunDraggableDimension',
			value: function getMinimunDraggableDimension() {
				var parentConf = this.gridConf,
				    collection = this.gridConfCollection,
				    gridCount = this.gridCount,
				    list = this.gridList,
				    move = {
					x: Infinity,
					y: Infinity
				};
	
				if (collection) {
					var boundings = void 0;
					for (var item in collection) {
						boundings = list[item].splitLayout && list[item].splitLayout.getMinimunDraggableDimension();
						move.x > boundings.x && (move.x = boundings.x);
						move.y > boundings.y && (move.y = boundings.y);
					}
				} else {
					var rows = gridCount.rows,
					    cols = gridCount.columns;
					if (rows > 1 && cols === 1) {
						return {
							x: parentConf.wMax,
							y: parentConf.hSum
						};
					} else if (rows === 1 && cols > 1) {
						return {
							x: parentConf.wSum,
							y: parentConf.hMax
						};
					} else {
						return {
							x: parentConf.wSum,
							y: parentConf.hSum
						};
					}
				}
				return move;
			}
		}, {
			key: 'createSplit',
			value: function createSplit(splits, cb) {
				Object.keys(this.gridList).length > 1 && this._removeAllGrids();
	
				var rows = Number(splits[0]) || 1,
				    columns = Number(splits[1]) || 1,
				    parentElem = this.parent,
				    conf = this.config(),
				    parentHeight = parentElem.offsetHeight,
				    parentWidth = parentElem.offsetWidth,
				    margin = conf.margin,
				    padding = conf.padding,
				    calculatedHeight = Math.floor(parentHeight / rows - margin * 2),
				    calculatedWidth = Math.floor(parentWidth / columns - margin * 2),
				    numberOfDivs = rows * columns,
				    config = {
					height: calculatedHeight + 'px',
					width: calculatedWidth + 'px',
					margin: margin + 'px',
					padding: padding + 'px'
				};
	
				this.setDraggableDimension(calculatedHeight, calculatedWidth, rows, columns);
	
				for (var i = 0; i < numberOfDivs; i++) {
					var grid = new _grid2.default(parentElem),
					    id = (parentElem.id || 'gridLayout') + this.elementCounter++;
	
					grid.setConfigaration(this.getConfiguration());
					grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
					grid.root = this;
					grid.index = this.elementCounter - 1;
	
					this.gridList[this.elementCounter - 1] = grid;
				}
	
				this._createSliders(rows, columns, parentHeight, parentWidth, calculatedHeight, calculatedWidth);
				this.gridCount = {
					rows: rows,
					columns: columns
				};
	
				typeof cb === 'function' && cb.call(this, this.gridList);
				return this;
			}
		}, {
			key: 'createGoldSplit',
			value: function createGoldSplit(orientation, cb) {
				var parentElem = this.parent,
				    conf = this.config(),
				    parentHeight = parentElem.offsetHeight,
				    parentWidth = parentElem.offsetWidth,
				    margin = conf.margin,
				    padding = conf.padding,
				    or = orientation && orientation[0].toLowerCase() === 'v' || false,
				    calculatedHeight = or ? this._getGoldenRatio(parentHeight) : Math.floor(parentHeight - margin * 2),
				    calculatedWidth = !or ? this._getGoldenRatio(parentWidth) : Math.floor(parentWidth - margin * 2),
				    config = {
					margin: margin + 'px',
					padding: padding + 'px'
				},
				    rows = or ? 2 : 1,
				    columns = or ? 1 : 2;
	
				this._createSliders(rows, columns, parentHeight, parentWidth, calculatedHeight, calculatedWidth);
				this.gridCount = {
					rows: rows,
					columns: columns
				};
	
				this.childConf = {
					hMax: parentHeight / 2,
					hSum: parentHeight / 2,
					wMax: parentHeight / 2,
					wSum: parentWidth / 2
				};
				this.setDraggableDimension(parentHeight / 2, parentWidth / 2, rows, columns);
				for (var i = 0; i < 2; i++) {
					config.height = (Array.isArray(calculatedHeight) ? calculatedHeight[i] - margin * 2.1 : calculatedHeight) + 'px';
					config.width = (Array.isArray(calculatedWidth) ? calculatedWidth[i] - margin * 2.1 : calculatedWidth) + 'px';
	
					var grid = new _grid2.default(parentElem),
					    id = (parentElem.id || 'gridLayout') + this.elementCounter++;
	
					grid.setConfigaration(this.getConfiguration());
					grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
					grid.root = this;
					grid.index = this.elementCounter - 1;
					this.gridList[this.elementCounter - 1] = grid;
				}
	
				typeof cb === 'function' && cb.call(this, this.gridList);
				return this;
			}
		}, {
			key: '_getGoldenRatio',
			value: function _getGoldenRatio(n) {
				var goldLarge = Math.floor(n / 1.618),
				    goldSmall = Math.floor(n - goldLarge);
				return [goldLarge, goldSmall];
			}
		}, {
			key: '_createSliders',
			value: function _createSliders(r, c, h, w, ch, cw) {
				var _this = this;
	
				var slider = this.slider || (this.slider = []),
				    self = this,
				    config = {
					position: 'absolute'
				},
				    margin = 5,
				    _conf = this.getConfiguration();
	
				if (r > 1) {
					// for r = 3 there will be (3-1) horizontal sliders
					var sliderHeight = margin * 2,
					    sliderWidth = w - margin * 2;
	
					var _loop = function _loop(i) {
						var startHeight = Array.isArray(ch) ? ch[i - 1] - margin : ch + margin - margin / i * (i - 1),
						    top = startHeight * i + sliderHeight * (i - 1);
	
						config.top = top + 'px';
						config.left = margin + 'px';
						config.height = sliderHeight + 'px';
						config.width = sliderWidth + 'px';
						config.background = _conf.sliderBackground;
						config.zIndex = 10;
	
						var elem = (0, _utils._createElement)('div'),
						    id = '' + i,
						    len = slider.length;
	
						(0, _utils._addStyle)(elem, config);
						slider.push({
							slider: elem,
							isVertical: false,
							y: 0,
							currY: top,
							newY: 0,
							isSelected: false,
							addMe: 0
						});
						elem.id = _this.parent.id + id;
	
						var sliderProps = slider[len];
	
						elem.addEventListener('mouseover', function () {
							this.style.background = _conf.sliderHoverColor;
							this.style.cursor = 'ns-resize';
							this.style.zIndex = parseInt(this.style.zIndex) + 1;
						});
						elem.addEventListener('mouseout', function () {
							!sliderProps.isSelected && (this.style.background = _conf.sliderBackground);
						});
						elem.addEventListener('mousedown', function (e) {
							sliderProps.isSelected = true;
							sliderProps.y = e.clientY - parseInt(elem.offsetTop);
						});
						elem.addEventListener('mouseup', function () {
							sliderProps.isSelected = false;
							if (sliderProps.newY) {
								// if newx is greater the zero
								var change = sliderProps.currY - sliderProps.newY,
								    prevSlider = slider[len - 1],
								    nextSlider = slider[len + 1],
								    addme = sliderProps.addMe * 2;
	
								if (!sliderProps.dimensions) {
									var dim = sliderProps.dimensions = {},
									    props1 = sliderProps.dependencies = self._resize(i, false);
	
									dim.y1 = (props1[2].y === Infinity ? self.gridConf.hMax : props1[2].y) - addme;
									dim.y2 = (props1[3].y === Infinity ? self.gridConf.hMax : props1[3].y) - addme;
								}
								// previous slider
								if (slider[len - 1] && slider[len - 1].isVertical === false && !slider[len - 1].dimensions) {
									var _sliderProps = slider[len - 1],
									    _dim = _sliderProps.dimensions = {},
									    _props = _sliderProps.dependencies = self._resize(i - 1, false);
	
									_dim.y1 = (_props[2].y === Infinity ? self.gridConf.hMax : _props[2].y) - addme;
									_dim.y2 = (_props[3].y === Infinity ? self.gridConf.hMax : _props[3].y) - addme;
								}
								// next slider
								if (slider[len + 1] && slider[len + 1].isVertical === false && !slider[len + 1].dimensions) {
									var _sliderProps2 = slider[len + 1],
									    _dim2 = _sliderProps2.dimensions = {},
									    _props2 = _sliderProps2.dependencies = self._resize(i + 1, false);
	
									_dim2.y1 = (_props2[2].y === Infinity ? self.gridConf.hMax : _props2[2].y) - addme;
									_dim2.y2 = (_props2[3].y === Infinity ? self.gridConf.hMax : _props2[3].y) - addme;
								}
	
								if (change > 0) {
									if (change > sliderProps.dimensions.y1) {
										change = sliderProps.dimensions.y1;
										sliderProps.dimensions.y2 += sliderProps.dimensions.y1;
										nextSlider && nextSlider.isVertical === false && (nextSlider.dimensions.y1 += sliderProps.dimensions.y1);
										prevSlider && prevSlider.isVertical === false && (prevSlider.dimensions.y2 -= sliderProps.dimensions.y1);
										// update slider position
										sliderProps.newY = sliderProps.currY - sliderProps.dimensions.y1;
										elem.style.top = sliderProps.newY + 'px';
										sliderProps.dimensions.y1 = 0;
									} else {
										sliderProps.dimensions.y2 += change;
										nextSlider && nextSlider.isVertical === false && (nextSlider.dimensions.y1 += change);
										prevSlider && prevSlider.isVertical === false && (prevSlider.dimensions.y2 -= change);
										sliderProps.dimensions.y1 -= change;
									}
								} else {
									var _change = Math.abs(change);
									if (_change > sliderProps.dimensions.y2) {
										// dont go down
										_change = sliderProps.dimensions.y2;
										sliderProps.dimensions.y1 += sliderProps.dimensions.y2;
										nextSlider && nextSlider.isVertical === false && (nextSlider.dimensions.y1 -= sliderProps.dimensions.y2);
										prevSlider && prevSlider.isVertical === false && (prevSlider.dimensions.y2 += sliderProps.dimensions.y2);
										// update slider position
										sliderProps.newY = sliderProps.currY + sliderProps.dimensions.y2;
										elem.style.top = sliderProps.newY + 'px';
										sliderProps.dimensions.y2 = 0;
									} else {
										// change normally
										sliderProps.dimensions.y2 -= _change;
										nextSlider && nextSlider.isVertical === false && (nextSlider.dimensions.y1 -= _change);
										prevSlider && prevSlider.isVertical === false && (prevSlider.dimensions.y2 += _change);
										sliderProps.dimensions.y1 += _change;
									}
									change = -1 * _change;
								}
	
								self._excuteSliderChange(false, change, sliderProps.dependencies[0], sliderProps.dependencies[1]);
								sliderProps.currY = sliderProps.newY;
							}
						});
						_this.parent.addEventListener('mousemove', function (e) {
							if (sliderProps.isSelected == true) {
								sliderProps.newY = e.clientY - sliderProps.y;
								elem.style.top = sliderProps.newY + 'px';
							}
						});
	
						_this.parent.appendChild(elem);
					};
	
					for (var i = 1; i < r; i++) {
						_loop(i);
					}
				}
	
				if (c > 1) {
					var _sliderHeight = h - margin * 2,
					    _sliderWidth = margin * 2;
	
					var _loop2 = function _loop2(i) {
						var startWidth = Array.isArray(cw) ? cw[i - 1] - margin : cw,
						    left = startWidth * i + _sliderWidth * (i - 1);
						/* @todo: below line is done as non-gold layout margin is not add
	     	add margin value at time of creation */
						!Array.isArray(cw) && (left += margin);
						// the above line
						config.top = margin + 'px';
						config.left = left + 'px';
						config.height = _sliderHeight + 'px';
						config.width = _sliderWidth + 'px';
						config.background = _conf.sliderBackground;
						//config.transition = 'all ease 0.2s';
	
						var elem = (0, _utils._createElement)('div'),
						    id = '' + i,
						    len = slider.length,
						    sliderProps = void 0;
	
						(0, _utils._addStyle)(elem, config);
						elem.id = _this.parent.id + id;
						slider.push({
							slider: elem,
							isVertical: true,
							x: 0,
							currX: left,
							newX: 0,
							isSelected: false,
							addMe: 0
						});
						sliderProps = slider[len];
	
						elem.addEventListener('mouseover', function () {
							this.style.background = _conf.sliderHoverColor;
							this.style.cursor = 'ew-resize';
							this.style.zIndex += 1;
						});
						elem.addEventListener('mouseout', function () {
							!sliderProps.isSelected && (this.style.background = _conf.sliderBackground);
						});
						elem.addEventListener('mousedown', function (e) {
							sliderProps.isSelected = true;
							sliderProps.x = e.clientX - parseInt(elem.offsetLeft);
						});
						elem.addEventListener('mouseup', function () {
							sliderProps.isSelected = false;
							if (sliderProps.newX) {
								var change = sliderProps.currX - sliderProps.newX,
								    prevSlider = slider[len - 1],
								    nextSlider = slider[len + 1],
								    addme = sliderProps.addMe * 2;
	
								if (!sliderProps.dimensions) {
									var dim = sliderProps.dimensions = {},
									    props1 = sliderProps.dependencies = self._resize(i, true);
	
									dim.x1 = (props1[2].x === Infinity ? self.gridConf.wMax : props1[2].x) - addme;
									dim.x2 = (props1[3].x === Infinity ? self.gridConf.wMax : props1[3].x) - addme;
								}
								// previous slider
								if (slider[len - 1] && slider[len - 1].isVertical === true && !slider[len - 1].dimensions) {
									var _sliderProps3 = slider[len - 1],
									    _dim3 = _sliderProps3.dimensions = {},
									    _props3 = _sliderProps3.dependencies = self._resize(i - 1, true);
	
									_dim3.x1 = (_props3[2].x === Infinity ? self.gridConf.wMax : _props3[2].x) - addme;
									_dim3.x2 = (_props3[3].x === Infinity ? self.gridConf.wMax : _props3[3].x) - addme;
								}
								// next slider
								if (slider[len + 1] && slider[len + 1].isVertical === true && !slider[len + 1].dimensions) {
									var _sliderProps4 = slider[len + 1],
									    _dim4 = _sliderProps4.dimensions = {},
									    _props4 = _sliderProps4.dependencies = self._resize(i + 1, true);
	
									_dim4.x1 = (_props4[2].x === Infinity ? self.gridConf.wMax : _props4[2].x) - addme;
									_dim4.x2 = (_props4[3].x === Infinity ? self.gridConf.wMax : _props4[3].x) - addme;
								}
	
								if (change > 0) {
									// moving left
									if (change > sliderProps.dimensions.x1) {
										change = sliderProps.dimensions.x1;
										sliderProps.dimensions.x2 += sliderProps.dimensions.x1;
										nextSlider && nextSlider.isVertical === true && (nextSlider.dimensions.x1 += sliderProps.dimensions.x1);
										prevSlider && prevSlider.isVertical === true && (prevSlider.dimensions.x2 -= sliderProps.dimensions.x1);
										// update slider position
										sliderProps.newX = sliderProps.currX - sliderProps.dimensions.x1;
										elem.style.left = sliderProps.newX + 'px';
										sliderProps.dimensions.x1 = 0;
									} else {
										sliderProps.dimensions.x2 += change;
										nextSlider && nextSlider.isVertical === true && (nextSlider.dimensions.x1 += change);
										prevSlider && prevSlider.isVertical === true && (prevSlider.dimensions.x2 -= change);
										sliderProps.dimensions.x1 -= change;
									}
								} else {
									// moving right
	
									var _change = Math.abs(change);
									if (_change > sliderProps.dimensions.x2) {
										// dont go down
										_change = sliderProps.dimensions.x2;
										sliderProps.dimensions.x1 += sliderProps.dimensions.x2;
										nextSlider && nextSlider.isVertical === true && (nextSlider.dimensions.x1 -= sliderProps.dimensions.x2);
										prevSlider && prevSlider.isVertical === true && (prevSlider.dimensions.x2 += sliderProps.dimensions.x2);
										// update slider position
										sliderProps.newX = sliderProps.currX + sliderProps.dimensions.x2;
										elem.style.left = sliderProps.newX + 'px';
										sliderProps.dimensions.x2 = 0;
									} else {
										// change normally
										sliderProps.dimensions.x2 -= _change;
										nextSlider && nextSlider.isVertical === true && (nextSlider.dimensions.x1 -= _change);
										prevSlider && prevSlider.isVertical === true && (prevSlider.dimensions.x2 += _change);
										sliderProps.dimensions.x1 += _change;
									}
									change = -1 * _change;
								}
								self._excuteSliderChange(true, change, sliderProps.dependencies[0], sliderProps.dependencies[1]);
								// change current position of x
								sliderProps.currX = sliderProps.newX;
							}
						});
						self.parent.addEventListener('mousemove', function (e) {
							if (sliderProps.isSelected == true) {
								sliderProps.newX = e.clientX - sliderProps.x;
								elem.style.left = sliderProps.newX + 'px';
							}
						});
	
						self.parent.appendChild(elem);
					};
	
					for (var i = 1; i < c; i++) {
						_loop2(i);
					}
				}
				return slider;
			}
			/**
	   * 
	   * @param {number} i - index of the slider 
	   * @param {Boolean} isVertical - The slider is vertical or not
	   */
	
		}, {
			key: '_resize',
			value: function _resize(i, isVertical) {
				var gridCount = this.gridCount,
				    list = this.gridList,
				    count = 0,
				    c = 0,
				    side1 = [],
				    side2 = [],
				    boundings = void 0,
				    movePos = {
					x: Infinity,
					y: Infinity
				},
				    moveNeg = {
					x: Infinity,
					y: Infinity
				};
	
				if (isVertical) {
					count = gridCount['rows'];
					c = gridCount['columns'];
				} else {
					c = gridCount['rows'];
					count = gridCount['columns'];
				}
	
				for (var j = 0; j < count; j++) {
					var k1 = void 0,
					    k2 = void 0;
	
					if (count > 1 && !isVertical) {
						var startingPoint = count * (i - 1);
						k1 = startingPoint + j;
						k2 = startingPoint + j + count;
					} else {
						k2 = i + j * c;
						k1 = k2 - 1;
					}
	
					side1.push(list[k1]);
					side2.push(list[k2]);
				}
				// if change is negetive select side2
				// check the measurement for both sides negetive and positive	
				side1.forEach(function (i) {
					boundings = i.splitLayout && i.splitLayout.getMinimunDraggableDimension();
					boundings && movePos.x > boundings.x && (movePos.x = boundings.x);
					boundings && movePos.y > boundings.y && (movePos.y = boundings.y);
				});
				side2.forEach(function (i) {
					boundings = i.splitLayout && i.splitLayout.getMinimunDraggableDimension();
					boundings && moveNeg.x > boundings.x && (moveNeg.x = boundings.x);
					boundings && moveNeg.y > boundings.y && (moveNeg.y = boundings.y);
				});
	
				return [side1, side2, movePos, moveNeg];
			}
			/**
	   * 
	   * @param {Boolean} isVertical - Slider is vertical or not
	   * @param {Number} change - the amount of change
	   * @param {Array} s1 - side 1
	   * @param {Array} s2 - side 2
	   */
	
		}, {
			key: '_excuteSliderChange',
			value: function _excuteSliderChange(isVertical, change, s1, s2) {
				s1.forEach(function (i) {
					i.resizeInnerContainers(isVertical, change, 0);
				});
				s2.forEach(function (i) {
					i.resizeInnerContainers(isVertical, change, 1);
				});
	
				return this;
			}
		}]);
	
		return TrussLayout;
	}();
	
	exports.default = TrussLayout;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _manager = __webpack_require__(1);
	
	var _manager2 = _interopRequireDefault(_manager);
	
	var _button = __webpack_require__(3);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _utils = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Grid = function () {
		function Grid(_parent) {
			_classCallCheck(this, Grid);
	
			this.parentElement = _parent;
			this.childGrids = {};
			this.buttons = {};
			this.dimensions = {};
			this.buttonCounter = 0;
			this.boundingClictDimension = null;
		}
	
		_createClass(Grid, [{
			key: '_config',
			value: function _config() {
				return Object.assign({}, Grid.defaultConfig(), this.dimensions, { background: this.getConfiguration().background });
			}
		}, {
			key: 'setConfigaration',
			value: function setConfigaration(conf) {
				this.configuration = conf;
				return this;
			}
		}, {
			key: 'getConfiguration',
			value: function getConfiguration() {
				return this.configuration;
			}
		}, {
			key: 'setDimensions',
			value: function setDimensions(_dim) {
				this.dimensions = _dim;
				return this;
			}
		}, {
			key: '_setBoundingClintDimension',
			value: function _setBoundingClintDimension(conf) {
				this.boundingClictDimension = conf;
				return this;
			}
		}, {
			key: 'getBoundingClintDimension',
			value: function getBoundingClintDimension() {
				return this.boundingClictDimension;
			}
		}, {
			key: '_setOrientation',
			value: function _setOrientation(v) {
				this.orientation = v;
				return this;
			}
		}, {
			key: 'isVertical',
			value: function isVertical() {
				return this.orientation;
			}
		}, {
			key: '_createDiv',
			value: function _createDiv(id) {
				var elem = document.createElement('div');
				this.id = elem.id = id;
				(0, _utils._addStyle)(elem, this._config());
	
				this.parentElement && this.parentElement.appendChild(elem);
				this.node = elem;
				return this;
			}
		}, {
			key: 'remove',
			value: function remove() {
				var parentElement = this.node.parentElement;
				parentElement.removeChild(this.node);
			}
		}, {
			key: 'getNode',
			value: function getNode() {
				return this.node;
			}
	
			// return id of the grid
	
		}, {
			key: 'getId',
			value: function getId() {
				return this.node.id;
			}
		}, {
			key: 'addContainer',
			value: function addContainer(cb) {
				if (this.chartContainer) {
					cb && cb.call(null, id);
					return this.chartContainer;
				}
				var buttonStatus = this.maxButton,
				    chartContainer = this.chartContainer = document.createElement('div'),
				    config = {
					position: 'absolute',
					background: this.getConfiguration().containerBackground
				},
				    id = this.getId() + 'ChartContainer',
				    parentElement = this.getNode(),
				    height = parentElement.offsetHeight - 10,
				    width = parentElement.offsetWidth - 10,
				    top = 5,
				    left = 5;
	
				buttonStatus.horizontalCount.top > 1 && (top += 40) && (height -= 40);
				buttonStatus.horizontalCount.bottom > 1 && (height -= 40);
				buttonStatus.verticalCount.left > 1 && (left += 40) && (width -= 40);
				buttonStatus.verticalCount.right > 1 && (width -= 40);
	
				config.top = top + 'px';
				config.left = left + 'px';
				config.height = height + 'px';
				config.width = width + 'px';
	
				chartContainer.id = id;
				(0, _utils._addStyle)(chartContainer, config);
				parentElement.appendChild(chartContainer);
	
				cb && cb.call(null, this.chartContainer);
	
				return chartContainer;
			}
		}, {
			key: '_getContainerDimension',
			value: function _getContainerDimension() {
				if (!this.chartContainer) {
					return {};
				}
				var buttonStatus = this.maxButton,
				    parentElement = this.getNode(),
				    height = parentElement.offsetHeight - 10,
				    width = parentElement.offsetWidth - 10,
				    top = 5,
				    left = 5,
				    config = {};
	
				buttonStatus.horizontalCount.top > 1 && (top += 40) && (height -= 40);
				buttonStatus.horizontalCount.bottom > 1 && (height -= 40);
				buttonStatus.verticalCount.left > 1 && (left += 40) && (width -= 40);
				buttonStatus.verticalCount.right > 1 && (width -= 40);
	
				config.top = top + 'px';
				config.left = left + 'px';
				config.height = height + 'px';
				config.width = width + 'px';
	
				return config;
			}
		}, {
			key: 'resizeContainer',
			value: function resizeContainer() {
				if (!this.chartContainer) {
					return null;
				}
	
				(0, _utils._addStyle)(this.chartContainer, this._getContainerDimension());
			}
		}, {
			key: 'getContainerId',
			value: function getContainerId() {
				var id = this.chartContainer ? this.chartContainer.id : this.addContainer().id;
				return id;
			}
		}, {
			key: 'createSplit',
			value: function createSplit(split, cb) {
				var splitLayout = this.splitLayout = new _manager2.default(this.node);
				splitLayout.setConfigaration(this.getConfiguration());
				this.root && (splitLayout.parentManager = this.root, splitLayout.index = this.index);
	
				return splitLayout.createSplit(split, cb);
			}
		}, {
			key: 'createGoldenSplit',
			value: function createGoldenSplit(or, cb) {
				var splitLayout = this.splitLayout = new _manager2.default(this.node);
				splitLayout.setConfigaration(this.getConfiguration());
				this.root && (splitLayout.parentManager = this.root, splitLayout.index = this.index);
	
				return splitLayout.createGoldSplit(or, cb);
			}
		}, {
			key: 'addButton',
			value: function addButton(contentConf, orientation, events) {
				var _this = this;
	
				if (!orientation) {
					orientation = {
						position: 'tl',
						orientation: 'horizontal'
					};
				}
				if (!this._canAddButton(orientation)) {
					return this;
				}
				var config = {
					position: this._getButtonConfig(orientation),
					content: this._parseContentConfig(contentConf),
					configuration: this.getConfiguration()
				},
				    id = this.getId() + 'Button' + this.buttonCounter,
				    btnInstance = this.buttons[id] = new _button2.default(this.getNode(), config),
				    btn = void 0;
	
				btn = btnInstance.render().getNode();
	
				if (events && Array.isArray(events)) {
					events.forEach(function (i) {
						i.name && i.callback && _this._addEvent(btn, i.name, i.callback.bind(_this));
					});
				} else if (events && (typeof events === 'undefined' ? 'undefined' : _typeof(events)) === 'object') {
					events.name && events.callback && this._addEvent(btn, events.name, events.callback.bind(this));
				}
				return btn;
			}
		}, {
			key: '_addEvent',
			value: function _addEvent(elem, name, cb) {
				typeof name === 'string' && typeof cb === 'function' && elem.addEventListener(name, cb);
				return this;
			}
		}, {
			key: '_parseContentConfig',
			value: function _parseContentConfig(conf) {
				var contentConfig = {};
				switch (typeof conf === 'undefined' ? 'undefined' : _typeof(conf)) {
					case 'string':
						contentConfig.type = 'a';
						contentConfig.innerHTML = conf;
						break;
					case 'object':
						if (conf.text) {
							contentConfig.type = 'a';
							contentConfig.innerHTML = conf.text;
						} else if (conf.src) {
							contentConfig.type = 'img';
							contentConfig.src = conf.src;
						} else {
							contentConfig = conf;
						}
						break;
					default:
						contentConfig.type = 'a';
						contentConfig.innerHTML = '';
				}
				return contentConfig;
			}
			/**
	   * Generates JSON Schema for button Orientation
	   * @returns {ob} - JSON object
	   */
	
		}, {
			key: '_generateOrientationObj',
			value: function _generateOrientationObj() {
				var i = ['top', 'bottom'],
				    ii = ['left', 'right'],
				    iii = ['horizontal', 'vertical'],
				    ob = {};
	
				i.forEach(function (_i) {
					ob[_i] = {};
					ii.forEach(function (_ii) {
						ob[_i][_ii] = {};
						iii.forEach(function (_iii) {
							ob[_i][_ii][_iii] = {
								isModified: false
							};
							ob[_i][_ii][_iii][_i] = 0;
							ob[_i][_ii][_iii][_ii] = 0;
						});
					});
				});
	
				return ob;
			}
		}, {
			key: '_parsePosition',
			value: function _parsePosition(str) {
				var position = {
					'T': 'top',
					'L': 'left',
					'R': 'right',
					'B': 'bottom'
				},
				    posStr = void 0;
				if (str && str.length == '2') {
					posStr = position[str[0].toUpperCase()] + '-' + position[str[1].toUpperCase()];
				} else {
					posStr = str.replace(/\s/g, '') || 'top-left'; // white spaces removed
				}
	
				return posStr;
			}
		}, {
			key: 'facet',
			value: function facet(n, orientation) {
				orientation = orientation && orientation.toLowerCase()[0] || 'v';
				var split = [];
				if (Array.isArray(n)) {
					split = n;
				} else if (typeof n !== 'number' && parseInt(n) < 2 || n < 2) {
					return this;
				} else {
					if (orientation === 'v') {
						split[0] = 1;
						split[1] = n;
					} else {
						split[0] = n;
						split[1] = 1;
					}
				}
				for (var i in this.buttons) {
					this.getNode().removeChild(this.buttons[i].node);
				}
				this.getNode().removeChild(this.chartContainer);
				this.chartContainer = null;
				this.buttons = {};
				return this.createSplit(split);
			}
		}, {
			key: '_getButtonConfig',
			value: function _getButtonConfig(or) {
				var _this2 = this;
	
				var position = or.position,
				    HORIZONTAL = 'horizontal',
				    orientation = or.orientation || HORIZONTAL,
				    str = this._parsePosition(position),
				    posArr = str.split('-'),
				    status = this.orientation || (this.orientation = this._generateOrientationObj()),
				    currentPos = {};
	
				posArr.forEach(function (str) {
					status[str] && posArr.forEach(function (lr) {
						var _posObj = status[str][lr];
						if (_posObj) {
							for (var i in _posObj) {
								if (i === orientation) {
									currentPos[str] = _posObj[i][str] + 'px';
									currentPos[lr] = _posObj[i][lr] + 'px';
	
									orientation === HORIZONTAL ? (_posObj[i][lr] += 40, _this2.maxButton[orientation + 'Count'][str]++) : (_posObj[i][str] += 40, _this2.maxButton[orientation + 'Count'][lr]++);
	
									!_posObj[i]['isModified'] && (_posObj[i]['isModified'] = true);
								} else {
									if (!_posObj[i]['isModified']) {
										orientation === HORIZONTAL ? (_posObj[i][str] += 40, _this2.maxButton[orientation + 'Count'][lr]++) : (_posObj[i][lr] += 40, _this2.maxButton[orientation + 'Count'][str]++);
	
										_posObj[i]['isModified'] = true;
									}
								}
							}
						}
					});
				});
	
				return currentPos;
			}
			/**
	   * checks the total number of buttons added and returns boolean if any more buttons can be added or not
	   * @param {object} obj - orientation configaration
	   * @returns {}
	   */
	
		}, {
			key: '_canAddButton',
			value: function _canAddButton(obj) {
				var orientation = obj.orientation + 'Count',
				    pos = this._parsePosition(obj.position),
				    //obj.position.replace(/\s/g, ''),
				posArr = pos.split('-'),
				    currentBtnStatus = this.maxButton || (this.maxButton = this._calculateMaxButton()),
				    position = function (_or, _posArr) {
					var _pos = null;
					if (_or === 'horizontal') {
						_posArr.forEach(function (i) {
							(i === 'top' || i === 'bottom') && (_pos = i);
						});
					} else {
						_posArr.forEach(function (i) {
							(i === 'left' || i === 'right') && (_pos = i);
						});
					}
					return _pos;
				}(obj.orientation, posArr);
	
				return currentBtnStatus[orientation][position] < this.maxButton[obj.orientation];
			}
		}, {
			key: '_calculateMaxButton',
			value: function _calculateMaxButton() {
				var oh = this.node.offsetHeight,
				    ow = this.node.offsetWidth,
				    btnSize = 40;
	
				this.maxButton || (this.maxButton = {
					horizontal: Math.floor(ow / btnSize),
					vertical: Math.floor(oh / btnSize),
					horizontalCount: {
						top: 1,
						bottom: 1
					},
					verticalCount: {
						left: 1,
						right: 1
					}
				});
	
				return this;
			}
	
			// resizes parent and child components
	
		}, {
			key: 'resizeInnerContainers',
			value: function resizeInnerContainers(isvertical, change, operation) {
				var layout = this.splitLayout,
				    childContainers = layout && layout.gridList,
				    sliders = layout && layout.slider,
				    property = isvertical ? 'width' : 'height',
				    count = isvertical ? 'columns' : 'rows',
				    conf = layout && layout.gridCount,
				    n = conf && conf[count] || 1,
				    amount = change / n,
				    elem = this.getNode(),
				    dataConf = elem.getBoundingClientRect();
	
				// first change own dimension (width / height);
				elem.style[property] = (operation ? dataConf[property] + change : dataConf[property] - change) + 'px';
				this.resizeContainer();
	
				for (var key in sliders) {
					if (sliders.hasOwnProperty(key)) {
						this.changeSliderDimension(sliders[key], isvertical, amount, key, op, conf);
					}
				}
	
				if (!childContainers) {
					return this;
				}
	
				var op = property === 'height' || property === 'width' ? operation : 1;
	
				for (var _key in childContainers) {
					if (childContainers.hasOwnProperty(_key)) {
						childContainers[_key].resizeInnerContainers(isvertical, amount, op);
					}
				}
	
				return this;
			}
		}, {
			key: 'changeSliderDimension',
			value: function changeSliderDimension(sliderObj, isVertical, amount, key, op, conf) {
				var node = sliderObj.slider,
				    isVerticalSlider = sliderObj.isVertical,
				    numberOfCells = isVerticalSlider ? conf['rows'] : conf['columns'],
				    property = isVertical ? isVerticalSlider ? 'left' : 'width' : isVerticalSlider ? 'height' : 'top',
				    actualAmount = void 0,
				    calculatedAmount = void 0;
	
				if (property === 'width') {
					actualAmount = amount * numberOfCells;
				} else if (property === 'left') {
					var ic = Math.abs(conf['columns'] - 2 - Number(key)) + 1;
					actualAmount = amount * ic;
				} else if (property === 'height') {
					actualAmount = amount * numberOfCells;
				} else {
					actualAmount = (Number(key) + 1) * amount;
				}
				// change the amount of positve and negetive value
				if (isVerticalSlider === isVertical) {
					if (sliderObj.dimensions) {
						for (var i in sliderObj.dimensions) {
							sliderObj.dimensions[i] += amount;
						}
					} else {
						sliderObj.addMe += amount;
					}
				}
				calculatedAmount = parseFloat(node.style[property]) + (op ? actualAmount : actualAmount * -1);
	
				property === 'left' && sliderObj.currX && (sliderObj.currX = calculatedAmount);
				property === 'top' && sliderObj.currY && (sliderObj.currY = calculatedAmount);
	
				node.style[property] = calculatedAmount + 'px';
	
				return this;
			}
		}], [{
			key: 'defaultConfig',
			value: function defaultConfig() {
				return {
					float: 'left',
					position: 'relative'
				};
			}
		}]);
	
		return Grid;
	}();
	
	exports.default = Grid;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CircularButton = function () {
		/**
	  * @constructor
	  * config object will contain content type of the button
	  * 
	  **/
		function CircularButton(_parent, config) {
			_classCallCheck(this, CircularButton);
	
			this.parentElement = _parent;
			this.config = config;
			this.node = null;
		}
	
		_createClass(CircularButton, [{
			key: '_config',
			value: function _config() {
				return {
					'round-button': {
						width: '30px',
						height: '30px',
						position: 'absolute',
						margin: '10px'
					},
					'round-button-circle': {
						width: '100%',
						height: 0,
						paddingBottom: '100%',
						borderRadius: '50%',
						overflow: 'hidden',
						cursor: 'pointer',
						marginLeft: '1%'
					},
					'a': {
						display: 'block',
						float: 'left',
						width: '100%',
						paddingTop: '50%',
						paddingBottom: '50%',
						lineHeight: '1em',
						marginTop: '-0.5em',
						textAlign: 'center',
						color: '#e2eaf3',
						fontFamily: 'Verdana',
						fontSize: '1em',
						fontWeight: 'bold',
						textDecoration: 'none'
					},
					'img': {
						display: 'block',
						width: '76%',
						padding: '12%',
						height: 'auto'
					},
					'div': {
						display: 'block',
						width: '30px',
						height: '30px'
					}
				};
			}
		}, {
			key: '_createButton',
			value: function _createButton(conf) {
				if (!conf.type) {
					conf.type = 'a';
				} else if (conf.type === 'svg') {
					conf.type = 'div';
				}
				var outer = (0, _utils._createElement)('div'),
				    middle = (0, _utils._createElement)('div'),
				    inner = (0, _utils._createElement)(conf.type),
				    // depends on the content
				config = this._config();
	
				(0, _utils._addStyle)(outer, config['round-button']);
				(0, _utils._addStyle)(middle, config['round-button-circle']);
				(0, _utils._addStyle)(middle, {
					background: this.config.configuration.buttonBackgroung,
					color: this.config.configuration.buttonTextColor
				});
				(0, _utils._addStyle)(inner, config[conf.type]); //@todo change it as given type
	
				switch (conf.type) {
					case 'a':
						inner.href = conf.href || '#';inner.innerHTML = conf.innerHTML.toUpperCase() || 'TL';break;
					case 'img':
						inner.src = conf.src || '';break;
					case 'div':
						inner.innerHTML = conf.html || '';break;
				}
	
				outer.appendChild(middle);
				middle.appendChild(inner);
	
				return outer;
			}
	
			// after redering buttons chart will be rendered for better space management
	
		}, {
			key: 'render',
			value: function render() {
				var config = this.config,
				    position = config.position || { top: 0, left: 0 },
				    contentConf = config.content,
				    button = this.node = this._createButton(contentConf);
	
				(0, _utils._addStyle)(button, position);
	
				this.parentElement.appendChild(button);
				return this;
			}
		}, {
			key: 'getNode',
			value: function getNode() {
				return this.node;
			}
		}]);
	
		return CircularButton;
	}();
	
	exports.default = CircularButton;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function getRandomColor() {
		var letters = '0123456789ABCDEF',
		    color = '#';
	
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	function _addStyle(elem, _config) {
		for (var i in _config) {
			elem.style[i] = _config[i];
		}
		return this;
	}
	
	function _createElement(type) {
		if (type && typeof type === 'string') {
			return document.createElement(type);
		}
		return false;
	}
	
	/**
	* Rounds up a number to two decimal points.
	* @param {Number} d - given number to round up
	* @returns {Number} - rounded up number
	*/
	function roundUp(d) {
		return Math.round(d * 100) / 100;
	}
	
	exports.getRandomColor = getRandomColor;
	exports._addStyle = _addStyle;
	exports._createElement = _createElement;
	exports.roundUp = roundUp;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=truss.js.map