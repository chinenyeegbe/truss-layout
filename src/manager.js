import Grid from './grid.js';
import {
	_createElement,
	_addStyle,
	roundUp
} from './utils';

class TrussLayout {
	constructor(elem) {
		this.gridList = {};
		this.elementCounter = 0;
		this.parent = elem;
		this.gridCount = {};
	}

	config() {
		return {
			margin: 5,
			padding: 0
		};
	}

	resizeLayout(heightChange, widthChange) {
		let rows = this.gridCount.rows,
			cols = this.gridCount.columns,
			ch = roundUp(heightChange / rows),
			cw = roundUp(widthChange / cols),
			list = this.gridList,
			conf = this.gridCount;

		for (let i = 0, ii = this.slider.length; i < ii; i++) {
			let _slider = this.slider[i],
				isVertical = _slider.isVertical,
				elem = _slider.slider;

			if (isVertical) {
				let ic = (Math.abs(conf['columns'] - 2 - Number(i)) + 1),
					left = cw * ic;
				left = (parseFloat(elem.style.left) + left);
				// logic for changinf the left position
				elem.style.left = left + 'px';
				// logic for changing the height
				elem.style.height = (parseFloat(elem.style.height) + heightChange) + 'px';
				// changing slider current position
				_slider.currX && (_slider.currX = left);
			} else {
				let numberOfCells = isVertical ? conf['rows'] : conf['columns'];
				// logic for changing the top
				let top = ch + ch * i;
				top = (parseFloat(elem.style.top) + top);
				elem.style.top = top + 'px';
				// changing the current top position of the slider
				_slider.currY && (_slider.currY = top);
				// LOGIC for changing the width
				let width = cw * numberOfCells;
				elem.style.width = (parseFloat(elem.style.width) + width) + 'px';
			}
		}

		for (let i in list) {
			let node = list[i].getNode(),
				layout = list[i].splitLayout;

			node.style.height = (parseFloat(node.style.height) + ch) + 'px';
			node.style.width = (parseFloat(node.style.width) + cw) + 'px';
			list[i].resizeContainer();
			layout && layout.resizeLayout(ch, cw);
		}
	}

	_removeAllGrids() {
		for (let i in this.gridList) {
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
	setDraggableDimension(h, w, r, c) {
		let parentManager = this.parentManager,
			gridConf = this.gridConf = {
				hMax: h / 2,
				hSum: (h / 2) * r,
				wMax: w / 2,
				wSum: (w / 2) * c
			};
		if (parentManager) {
			parentManager.gridConfCollection || (parentManager.gridConfCollection = {});
			parentManager.gridConfCollection[this.index] = gridConf;
		}
	}

	getMinimunDraggableDimension() {
		let parentConf = this.gridConf,
			collection = this.gridConfCollection,
			gridCount = this.gridCount,
			list = this.gridList,
			move = {
				x: Infinity,
				y: Infinity
			};

		if (collection) {
			let boundings;
			for (let item in collection) {
				boundings = list[item].splitLayout && list[item].splitLayout.getMinimunDraggableDimension();
				move.x > boundings.x && (move.x = boundings.x);
				move.y > boundings.y && (move.y = boundings.y);
			}
		} else {
			let rows = gridCount.rows,
				cols = gridCount.columns;
			if (rows > 1 && cols === 1) {
				return {
					x: parentConf.wMax,
					y: parentConf.hSum
				}
			} else if (rows === 1 && cols > 1) {
				return {
					x: parentConf.wSum,
					y: parentConf.hMax
				}
			} else {
				return {
					x: parentConf.wSum,
					y: parentConf.hSum
				}
			}
		}
		return move;
	}

	createSplit(splits, cb) {
		Object.keys(this.gridList).length > 1 && this._removeAllGrids();

		let rows = Number(splits[0]) || 1,
			columns = Number(splits[1]) || 1,
			parentElem = this.parent,
			conf = this.config(),
			parentHeight = parentElem.offsetHeight,
			parentWidth = parentElem.offsetWidth,
			margin = conf.margin,
			padding = conf.padding,
			calculatedHeight = Math.floor((parentHeight / rows) - (margin * 2)),
			calculatedWidth = Math.floor((parentWidth / columns) - (margin * 2)),
			numberOfDivs = rows * columns,
			config = {
				height: `${calculatedHeight}px`,
				width: `${calculatedWidth}px`,
				margin: `${margin}px`,
				padding: `${padding}px`
			};

		this.setDraggableDimension(calculatedHeight, calculatedWidth, rows, columns);

		for (let i = 0; i < numberOfDivs; i++) {
			let grid = new Grid(parentElem),
				id = (parentElem.id || 'gridLayout') + this.elementCounter++;
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

	createGoldSplit(orientation, cb) {
		let parentElem = this.parent,
			conf = this.config(),
			parentHeight = parentElem.offsetHeight,
			parentWidth = parentElem.offsetWidth,
			margin = conf.margin,
			padding = conf.padding,
			or = orientation && orientation[0].toLowerCase() === 'v' || false,
			calculatedHeight = or ? this._getGoldenRatio(parentHeight) : Math.floor(parentHeight - (margin * 2)),
			calculatedWidth = !or ? this._getGoldenRatio(parentWidth) : Math.floor(parentWidth - (margin * 2)),
			config = {
				margin: `${margin}px`,
				padding: `${padding}px`
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

		for (let i = 0; i < 2; i++) {
			let h,
				w;
			h = config.height = `${Array.isArray(calculatedHeight) ? (calculatedHeight[i] - (margin * 2.1)) : calculatedHeight}px`;
			w = config.width = `${Array.isArray(calculatedWidth) ? (calculatedWidth[i] - (margin * 2.1)) : calculatedWidth}px`;

			let grid = new Grid(parentElem),
				id = (parentElem.id || 'gridLayout') + this.elementCounter++;
			grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
			grid.root = this;

			this.gridList[this.elementCounter - 1] = grid;
		}

		typeof cb === 'function' && cb.call(this, this.gridList);
		return this;
	}

	_getGoldenRatio(n) {
		let goldLarge = Math.floor(n / 1.618),
			goldSmall = Math.floor(n - goldLarge);
		return [goldLarge, goldSmall];
	}

	_createSliders(r, c, h, w, ch, cw) {
		let slider = this.slider || (this.slider = []),
			self = this,
			config = {
				position: 'absolute'
			},
			margin = 5;

		if (r > 1) { // for r = 3 there will be (3-1) horizontal sliders
			let sliderHeight = margin * 2,
				sliderWidth = w - margin * 2;

			for (let i = 1; i < r; i++) {
				let startHeight = (Array.isArray(ch) ? ch[i - 1] - margin : (ch + margin - (margin / 2 * (i - 1)))),
					top = ((startHeight * i) + (sliderHeight * (i - 1)));

				config.top = `${top}px`;
				config.left = `${margin}px`;
				config.height = `${sliderHeight}px`;
				config.width = `${sliderWidth}px`;
				config.background = '#faebd7';
				config.zIndex = 10;

				let elem = _createElement('div'),
					id = `${i}`,
					len = slider.length;

				_addStyle(elem, config);
				slider.push({
					slider: elem,
					isVertical: false,
					y: 0,
					currY: top,
					newY: 0,
					isSelected: false,
					positive: null,
					negetive: null
				});
				elem.id = this.parent.id + id;

				let sliderProps = slider[len];

				elem.addEventListener('mouseover', function () {
					this.style.background = '#dbc28c';
					this.style.cursor = 'ns-resize';
					this.style.zIndex = parseInt(this.style.zIndex) + 1;
				});
				elem.addEventListener('mouseout', function () {
					!sliderProps.isSelected && (this.style.background = '#faebd7');
				});
				elem.addEventListener('mousedown', function (e) {
					sliderProps.isSelected = true;
					sliderProps.y = e.clientY - parseInt(elem.offsetTop);
				});
				elem.addEventListener('mouseup', function () {
					sliderProps.isSelected = false;
					if (sliderProps.newY) {
						// if newx is greater the zero
						let change = (sliderProps.currY - sliderProps.newY),
							prevSlider = slider[len - 1],
							nextSlider = slider[len + 1];

						if(!sliderProps.dimensions) {
							let dim = sliderProps.dimensions = {},
								props1 = sliderProps.dependencies = self._resize(i, false);

							dim.y1 = props1[2].y === Infinity ? (sliderProps.positive = self.gridConf.hMax) : (sliderProps.positive = props1[2].y);
							dim.y2 = props1[3].y === Infinity ? (sliderProps.positive = self.gridConf.hMax) : (sliderProps.positive = props1[3].y);
						}
						// previous slider
						if(slider[len - 1] && slider[len - 1].isVertical === false && !slider[len - 1].dimensions) {
							let sliderProps = slider[len - 1],
								dim = sliderProps.dimensions = {},
								props1 = sliderProps.dependencies = self._resize(i-1, false);
								
							dim.y1 = props1[2].y === Infinity ? (sliderProps.positive = self.gridConf.hMax) : (sliderProps.positive = props1[2].y);
							dim.y2 = props1[3].y === Infinity ? (sliderProps.positive = self.gridConf.hMax) : (sliderProps.positive = props1[3].y);
						}
						// next slider
						if(slider[len + 1] && slider[len + 1].isVertical === false && !slider[len + 1].dimensions) {
							let sliderProps = slider[len + 1],
								dim = sliderProps.dimensions = {},
								props1 = sliderProps.dependencies = self._resize(i+1, false);
								
							dim.y1 = props1[2].y === Infinity ? (sliderProps.positive = self.gridConf.hMax) : (sliderProps.positive = props1[2].y);
							dim.y2 = props1[3].y === Infinity ? (sliderProps.positive = self.gridConf.hMax) : (sliderProps.positive = props1[3].y);
						}

						if (change > 0) {
							if (change > sliderProps.dimensions.y1) {
								change = sliderProps.dimensions.y1;
								sliderProps.dimensions.y2 += sliderProps.dimensions.y1;
								nextSlider && (nextSlider.isVertical === false) && (nextSlider.dimensions.y1 += sliderProps.dimensions.y1);
								prevSlider && (prevSlider.isVertical === false) && (prevSlider.dimensions.y2 -= sliderProps.dimensions.y1);
								// update slider position
								sliderProps.newY = sliderProps.currY - sliderProps.dimensions.y1;
								elem.style.top = sliderProps.newY + 'px';
								sliderProps.dimensions.y1 = 0;
							} else {
								sliderProps.dimensions.y2 += change;
								nextSlider && (nextSlider.isVertical === false) && (nextSlider.dimensions.y1 += change);
								prevSlider && (prevSlider.isVertical === false) && (prevSlider.dimensions.y2 -= change);
								sliderProps.dimensions.y1 -= change;
							}
						} else {
							let _change = Math.abs(change);
							if(_change > sliderProps.dimensions.y2) { // dont go down
								_change = sliderProps.dimensions.y2;
								sliderProps.dimensions.y1 += sliderProps.dimensions.y2;
								nextSlider && (nextSlider.isVertical === false) && (nextSlider.dimensions.y1 -= sliderProps.dimensions.y2);
								prevSlider && (prevSlider.isVertical === false) && (prevSlider.dimensions.y2 += sliderProps.dimensions.y2);
								// update slider position
								sliderProps.newY = sliderProps.currY + sliderProps.dimensions.y2;
								elem.style.top = sliderProps.newY + 'px';
								sliderProps.dimensions.y2 = 0;
							} else { // change normally
								sliderProps.dimensions.y2 -= _change;
								nextSlider && (nextSlider.isVertical === false) && (nextSlider.dimensions.y1 -= _change);
								prevSlider && (prevSlider.isVertical === false) && (prevSlider.dimensions.y2 += _change);
								sliderProps.dimensions.y1 += _change;
							}
							change = -1 * _change;
						}

						self._excuteSliderChange(false, change, sliderProps.dependencies);
						sliderProps.currY = sliderProps.newY;
					}
					
				});
				this.parent.addEventListener('mousemove', function (e) {
					if (sliderProps.isSelected == true) {
						sliderProps.newY = (e.clientY - sliderProps.y);
						elem.style.top = sliderProps.newY + 'px';
					}
				});

				this.parent.appendChild(elem);
			}
		}

		if (c > 1) {
			let sliderHeight = h - margin * 2,
				sliderWidth = margin * 2;

			for (let i = 1; i < c; i++) {
				let startWidth = (Array.isArray(cw) ? cw[i - 1] - margin : cw),
					left = ((startWidth * i) + (sliderWidth * (i - 1)));
				/* @todo: below line is done as non-gold layout margin is not add
					add margin value at time of creation */
				!Array.isArray(cw) && (left += margin);
				// the above line
				config.top = `${margin}px`;
				config.left = `${left}px`;
				config.height = `${sliderHeight}px`;
				config.width = `${sliderWidth}px`;
				config.background = '#faebd7';

				let elem = _createElement('div'),
					id = `${i}`,
					len = slider.length,
					sliderProps;

				_addStyle(elem, config);
				elem.id = this.parent.id + id;
				slider.push({
					slider: elem,
					isVertical: true,
					x: 0,
					currX: left,
					newX: 0,
					isSelected: false,
					negetive: cw / 2,
					positive: cw / 2
				});
				sliderProps = slider[len];

				elem.addEventListener('mouseover', function () {
					this.style.background = '#dbc28c';
					this.style.cursor = 'ew-resize';
					this.style.zIndex += 1;
				});
				elem.addEventListener('mouseout', function () {
					!sliderProps.isSelected && (this.style.background = '#faebd7');
				});
				elem.addEventListener('mousedown', function (e) {
					sliderProps.isSelected = true;
					sliderProps.x = e.clientX - parseInt(elem.offsetLeft);
				});
				elem.addEventListener('mouseup', function () {
					sliderProps.isSelected = false;
					if (sliderProps.newX) {
						let change = (sliderProps.currX - sliderProps.newX),
							prevSlider = slider[len - 1],
							nextSlider = slider[len + 1];

						if(!sliderProps.dimensions) {
							let dim = sliderProps.dimensions = {},
								props1 = sliderProps.dependencies = self._resize(i, true);

							dim.x1 = props1[2].x === Infinity ? (sliderProps.positive = self.gridConf.wMax) : (sliderProps.positive = props1[2].x);
							dim.x2 = props1[3].x === Infinity ? (sliderProps.positive = self.gridConf.wMax) : (sliderProps.positive = props1[3].x);
						}
						// previous slider
						if(slider[len - 1] && slider[len - 1].isVertical === true && !slider[len - 1].dimensions) {
							let sliderProps = slider[len - 1],
								dim = sliderProps.dimensions = {},
								props1 = sliderProps.dependencies = self._resize(i-1, true);
								
							dim.x1 = props1[2].x === Infinity ? (sliderProps.positive = self.gridConf.wMax) : (sliderProps.positive = props1[2].x);
							dim.x2 = props1[3].x === Infinity ? (sliderProps.positive = self.gridConf.wMax) : (sliderProps.positive = props1[3].x);
						}
						// next slider
						if(slider[len + 1] && slider[len + 1].isVertical === true && !slider[len + 1].dimensions) {
							let sliderProps = slider[len + 1],
								dim = sliderProps.dimensions = {},
								props1 = sliderProps.dependencies = self._resize(i+1, true);
								
							dim.x1 = props1[2].x === Infinity ? (sliderProps.positive = self.gridConf.wMax) : (sliderProps.positive = props1[2].x);
							dim.x2 = props1[3].x === Infinity ? (sliderProps.positive = self.gridConf.wMax) : (sliderProps.positive = props1[3].x);
						}

						if(change > 0) { // moving left
							if(change > sliderProps.dimensions.x1) {
								change = sliderProps.dimensions.x1;
								sliderProps.dimensions.x2 += sliderProps.dimensions.x1;
								nextSlider && (nextSlider.isVertical === true) && (nextSlider.dimensions.x1 += sliderProps.dimensions.x1);
								prevSlider && (prevSlider.isVertical === true) && (prevSlider.dimensions.x2 -= sliderProps.dimensions.x1);
								// update slider position
								sliderProps.newX = sliderProps.currX - sliderProps.dimensions.x1;
								elem.style.left = sliderProps.newX + 'px';
								sliderProps.dimensions.x1 = 0;
							} else {
								sliderProps.dimensions.x2 += change;
								nextSlider && (nextSlider.isVertical === true) && (nextSlider.dimensions.x1 += change);
								prevSlider && (prevSlider.isVertical === true) && (prevSlider.dimensions.x2 -= change);
								sliderProps.dimensions.x1 -= change;
							}
						} else { // moving right
							let _change = Math.abs(change);
							if(_change > sliderProps.dimensions.x2) { // dont go down
								_change = sliderProps.dimensions.x2;
								sliderProps.dimensions.x1 += sliderProps.dimensions.x2;
								nextSlider && (nextSlider.isVertical === true) && (nextSlider.dimensions.x1 -= sliderProps.dimensions.x2);
								prevSlider && (prevSlider.isVertical === true) && (prevSlider.dimensions.x2 += sliderProps.dimensions.x2);
								// update slider position
								sliderProps.newX = sliderProps.currX + sliderProps.dimensions.x2;
								elem.style.left = sliderProps.newX + 'px';
								sliderProps.dimensions.x2 = 0;
							} else { // change normally
								sliderProps.dimensions.x2 -= _change;
								nextSlider && (nextSlider.isVertical === true) && (nextSlider.dimensions.x1 -= _change);
								prevSlider && (prevSlider.isVertical === true) && (prevSlider.dimensions.x2 += _change);
								sliderProps.dimensions.x1 += _change;
							}
							change = -1 * _change;
						}
						self._excuteSliderChange(true, change, sliderProps.dependencies);
						// change current position of x
						sliderProps.currX = sliderProps.newX;
					}
				});
				self.parent.addEventListener('mousemove', function (e) {
					if (sliderProps.isSelected == true) {
						sliderProps.newX = (e.clientX - sliderProps.x);
						elem.style.left = sliderProps.newX + 'px';
					}
				});

				self.parent.appendChild(elem);
			}
		}
		return slider;
	}

	_resize(i, isVertical) {
		let gridCount = this.gridCount,
			list = this.gridList,
			count = 0,
			c = 0,
			side1 = [],
			side2 = [],
			boundings,
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

		for (let j = 0; j < count; j++) {
			let k1,
				k2,
				item1,
				item2;

			if (count > 1 && !isVertical) {
				let startingPoint = count * (i - 1);
				k1 = startingPoint + j;
				k2 = startingPoint + j + count;
			} else {
				k2 = (i + (j * c)),
					k1 = k2 - 1;
			}

			item1 = list[k1];
			item2 = list[k2];

			side1.push(item1);
			side2.push(item2);
		}
		// if change is negetive select side2	
		side1.forEach(i => {
			boundings = i.splitLayout && i.splitLayout.getMinimunDraggableDimension();
			boundings && movePos.x > boundings.x && (movePos.x = boundings.x);
			boundings && movePos.y > boundings.y && (movePos.y = boundings.y);
		});
		side2.forEach(i => {
			boundings = i.splitLayout && i.splitLayout.getMinimunDraggableDimension();
			boundings && moveNeg.x > boundings.x && (moveNeg.x = boundings.x);
			boundings && moveNeg.y > boundings.y && (moveNeg.y = boundings.y);
		});

		return [side1, side2, movePos, moveNeg];
	}

	_excuteSliderChange(isVertical, change, props) {
		let s1 = props[0],
			s2 = props[1];

		s1.forEach(i => {
			i.resizeInnerContainers(isVertical, change, 0);
		});
		s2.forEach(i => {
			i.resizeInnerContainers(isVertical, change, 1);
		});

		return this;
	}
}

export {
	TrussLayout as
	default
};