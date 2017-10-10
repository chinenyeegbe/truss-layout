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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// export  TrussLayout;
	function _init(_parent) {
	    !_parent && (_parent = document.getElementsByTagName('body')[0]);
	    return new _manager2.default(_parent);
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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TrussLayout = function () {
		function TrussLayout(elem) {
			_classCallCheck(this, TrussLayout);
	
			this.gridList = {};
			this.elementCounter = 0;
			this.parent = elem;
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
			key: '_removeAllGrids',
			value: function _removeAllGrids() {
				for (var i in this.gridList) {
					this.parent.removeChild(this.gridList[i].getNode());
				}
				this.elementList = {};
				this.elementCounter = 0;
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
	
				for (var i = 0; i < numberOfDivs; i++) {
					var grid = new _grid2.default(parentElem),
					    id = (parentElem.id || 'gridLayout') + this.elementCounter++;
					grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
					this.gridList[this.elementCounter - 1] = grid;
				}
	
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
				};
	
				for (var i = 0; i < 2; i++) {
					config.height = (Array.isArray(calculatedHeight) ? calculatedHeight[i] - margin * 2.1 : calculatedHeight) + 'px';
					config.width = (Array.isArray(calculatedWidth) ? calculatedWidth[i] - margin * 2.1 : calculatedWidth) + 'px';
	
					var grid = new _grid2.default(parentElem),
					    id = (parentElem.id || 'gridLayout') + this.elementCounter++;
					grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
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
			key: 'render',
			value: function render() {}
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
		}
	
		_createClass(Grid, [{
			key: '_config',
			value: function _config() {
				return Object.assign({}, Grid.defaultConfig(), this.dimensions);
			}
		}, {
			key: 'setDimensions',
			value: function setDimensions(_dim) {
				this.dimensions = _dim;
				return this;
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
			key: 'removeDiv',
			value: function removeDiv() {}
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
					background: '#ffffff'
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
	
				cb && cb.call(null, id);
	
				return chartContainer;
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
				splitLayout.createSplit(split, cb);
				return this;
			}
		}, {
			key: 'createGoldenSplit',
			value: function createGoldenSplit(or, cb) {
				var splitLayout = this.splitLayout = new _manager2.default(this.node);
				splitLayout.createGoldSplit(or, cb);
				return this;
			}
		}, {
			key: 'addButton',
			value: function addButton(contentConf, orientation, events) {
				var _this = this;
	
				if (!this._canAddButton(orientation)) {
					return this;
				}
				var config = {
					position: this._getButtonConfig(orientation),
					content: this._parseContentConfig(contentConf)
				},
				    id = this.getId() + 'Button' + this.buttonCounter,
				    btnInstance = this.buttons[id] = new _button2.default(this.getNode(), config),
				    btn = void 0;
	
				btn = btnInstance.render().getNode();
	
				if (events && Array.isArray(events)) {
					events.forEach(function (i) {
						i.name && i.callback && _this._addEvent(btn, i.name, i.callback);
					});
				} else if (events && (typeof events === 'undefined' ? 'undefined' : _typeof(events)) === 'object') {
					events.name && events.callback && this._addEvent(btn, events.name, events.callback);
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
		}], [{
			key: 'defaultConfig',
			value: function defaultConfig() {
				return {
					background: (0, _utils.getRandomColor)(),
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
						background: '#4679BD',
						boxShadow: '0 0 3px gray',
						cursor: 'pointer'
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
					}
				};
			}
		}, {
			key: '_createButton',
			value: function _createButton(conf) {
				!conf.type && (conf.type = 'a');
				var outer = (0, _utils._createElement)('div'),
				    middle = (0, _utils._createElement)('div'),
				    inner = (0, _utils._createElement)(conf.type),
				    // depends on the content
				config = this._config();
	
				(0, _utils._addStyle)(outer, config['round-button']);
				(0, _utils._addStyle)(middle, config['round-button-circle']);
				(0, _utils._addStyle)(inner, config[conf.type]); //@todo change it as given type
	
				switch (conf.type) {
					case 'a':
						inner.href = conf.href || '#';inner.innerHTML = conf.innerHTML.toUpperCase() || 'TL';break;
					case 'img':
						inner.src = conf.src || '';break;
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
		return Math.round(d * 10) / 10;
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