import Grid from './grid.js';
import {_createElement, _addStyle} from './utils';

class TrussLayout {
	constructor(elem) {
		this.gridList = {};
		this.elementCounter = 0;
		this.parent = elem;
	}

	config() {
		return {
			margin: 5,
			padding: 0
		};
	}

	_removeAllGrids() {
		for (let i in this.gridList) {
			this.parent.removeChild(this.gridList[i].getNode());
		}
		this.elementList = {};
		this.elementCounter = 0;
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

		for (let i = 0; i < numberOfDivs; i++) {
			let grid = new Grid(parentElem),
				id = (parentElem.id || 'gridLayout') + this.elementCounter++;
			grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
			this.gridList[this.elementCounter - 1] = grid;
		}

		this._createSliders(rows, columns, parentHeight, parentWidth, calculatedHeight, calculatedWidth);

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
			};
		
		this._createSliders((or ? 2 : 1), (or ? 1 : 2), parentHeight, parentWidth, calculatedHeight, calculatedWidth);

		for (let i = 0; i < 2; i++) {
			config.height = `${Array.isArray(calculatedHeight) ? (calculatedHeight[i] - (margin * 2.1)) : calculatedHeight}px`;
			config.width = `${Array.isArray(calculatedWidth) ? (calculatedWidth[i] - (margin * 2.1)) : calculatedWidth}px`;

			let grid = new Grid(parentElem),
				id = (parentElem.id || 'gridLayout') + this.elementCounter++;
			grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
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
		let slider = this.slider || (this.slider = {
				vertical: {},
				horizontal: {}
			}),
			self = this,
			config = {
				position: 'absolute'
			},
			margin = 5;

		if (r > 1) { // for r = 3 there will be (3-1) horizontal sliders
			let sliderHeight = margin * 2,
				sliderWidth = w - margin * 2;

			for (let i = 1; i < r; i++) {
				let startHeight = (Array.isArray(ch) ? ch[i - 1] - margin : (ch + margin - (margin/2 * (i - 1)))),
					top = ((startHeight * i) + (sliderHeight * (i - 1)));

				config.top = `${top}px`;
				config.left = `${margin}px`;
				config.height = `${sliderHeight}px`;
				config.width = `${sliderWidth}px`;
				
				for(let j = 0; j < 2; j++) {
					let elem = _createElement('div'),
						id = `${i}${j}`;
					_addStyle(elem, config);
					slider.horizontal[`${i}${j}`] = elem;
					elem.id = this.parent.id + id;
					
					let isSelected = false,
						y = 0,
						currY = top,
						newY = 0;
					elem.addEventListener('mouseover', function () {
						this.style.background = '#000000';
						this.style.cursor = 'ns-resize';
						this.style.zIndex += 1;
					});
					elem.addEventListener('mouseout', function () {
						!isSelected && (this.style.background = '#ffffff');
					});
					elem.addEventListener('mousedown', function (e) {
						isSelected = true;
						y = e.clientY - parseInt(elem.offsetTop);
					});
					elem.addEventListener('mouseup', function () {
						isSelected = false;
						self._resize(currY, newY, i, false);
						currY = newY;
					});
					this.parent.addEventListener('mousemove', function (e) {
						if (isSelected == true) {
							newY = (e.clientY - y);
							elem.style.top = newY + 'px';
						}
					});

					this.parent.appendChild(elem);
				}
			}
		}

		if (c > 1) {
			let sliderHeight = h - margin * 2,
				sliderWidth = margin * 2;

			for (let i = 1; i < c; i++) {
				let startWidth = (Array.isArray(cw) ? cw[i - 1] - margin : cw),
					left;
				
				left = ((startWidth * i) + (sliderHeight * (i - 1)));
				config.top = `${margin}px`;
				config.left = `${left}px`;
				config.height = `${sliderHeight}px`;
				config.width = `${sliderWidth}px`;
				
				for(let j = 0; j < 2; j++) {
					let elem = _createElement('div'),
						id = `${i}${j}`;

					_addStyle(elem, config);
					elem.id = this.parent.id + id;
					slider.vertical[id] = elem;
					
					
					let isSelected = false,
						x = 0,
						currX = left,
						newX = 0;
					elem.addEventListener('mouseover', function () {
						this.style.background = '#000000';
						this.style.cursor = 'ew-resize';
						this.style.zIndex += 1;
					});
					elem.addEventListener('mouseout', function () {
						!isSelected && (this.style.background = '#ffffff');
					});
					elem.addEventListener('mousedown', function (e) {
						isSelected = true;
						x = e.clientX - parseInt(elem.offsetLeft);
					});
					elem.addEventListener('mouseup', function () {
						isSelected = false;
						self._resize(currX, newX, i, true);
						currX = newX;
					});
					self.parent.addEventListener('mousemove', function (e) {
						if (isSelected == true) {
							newX = (e.clientX - x);
							elem.style.left = newX + 'px';
						}
					});
					
					self.parent.appendChild(elem);
				}
			}
		}
	}

	_resize (c, n, i, isVertical) {
		console.log(this.gridList, i);
		let item1 = this.gridList[i - 1].getNode(),
			data1 = item1.getBoundingClientRect(),
			item2 = this.gridList[i].getNode(),
			data2 = item2.getBoundingClientRect();
		
		if(isVertical) {//move left
			item1.style.width = (data1.width - (c - n)) + 'px';
			item2.style.width = (data2.width + (c - n)) + 'px';
		} else {
			item1.style.height = (data1.height - (c - n)) + 'px';
			item2.style.height = (data2.height + (c - n)) + 'px';
		}
	}
}

export {
	TrussLayout as
	default
};