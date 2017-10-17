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
		this.gridCount = {
			horizontal: 0,
			vertical: 0
		};
	}

	config() {
		return {
			margin: 5,
			padding: 0
		};
	}

	resizeLayout (heightChange, widthChange) {
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
				let numberOfCells = isVertical ? conf['rows']: conf['columns'];
				// logic for changing the top
				let top =  ch + ch * i;
				top = (parseFloat(elem.style.top) + top);
				elem.style.top = top + 'px';
				// changing the current top position of the slider
				_slider.currY && (_slider.currY = top);
				// LOGIC for changing the width
				let width =  cw * numberOfCells;
				elem.style.width = (parseFloat(elem.style.width) + width) + 'px';
			}
		}
		
		for(let i in list) {
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

			this.gridCount['horizontal']++;
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

		for (let i = 0; i < 2; i++) {
			let h,
				w;
			h = config.height = `${Array.isArray(calculatedHeight) ? (calculatedHeight[i] - (margin * 2.1)) : calculatedHeight}px`;
			w = config.width = `${Array.isArray(calculatedWidth) ? (calculatedWidth[i] - (margin * 2.1)) : calculatedWidth}px`;

			let grid = new Grid(parentElem),
				id = (parentElem.id || 'gridLayout') + this.elementCounter++;
			grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
			grid._setBoundingClintDimension({
				height: parseInt(h),
				width: parseInt(w),
				parentHeight: parentHeight,
				parentWidth: parentWidth,
				rows: rows,
				columns: columns
			})._setOrientation(or);

			this.gridCount[(or ? 'horizontal' : 'vertical')]++;
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
					isSelected: false
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
					self._resize((sliderProps.currY - sliderProps.newY), i, false);
					sliderProps.currY = sliderProps.newY;
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
					isSelected: false
				});
				sliderProps = slider[len];

				elem.addEventListener('mouseover', function() {
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
					sliderProps.newX && self._resize((sliderProps.currX - sliderProps.newX), i, true);
					sliderProps.currX = sliderProps.newX;
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

	_resize(change, i, isVertical) {
		let gridCount = this.gridCount,
			list = this.gridList,
			count = 0,
			c = 0;
		
		if(isVertical) {
			count =  gridCount['rows'];
			c = gridCount['columns'];
		} else {
			c =  gridCount['rows'];
			count = gridCount['columns'];
		}

		for(let j = 0; j < count; j++) {
			let k1,
				k2,
				item1,
				item2;

			if(count > 1 && !isVertical) {
				let startingPoint = count * (i - 1);
				k1 = startingPoint + j;
				k2 = startingPoint + j + count;
			} else {
				k2 = (i + (j * c)),
				k1 = k2 - 1;
			}
			
			item1 = list[k1],
			item2 = list[k2];

			if (isVertical) { //move left
				item1.resizeInnerContainers(isVertical, change, 0); // change 
				item2.resizeInnerContainers(isVertical, change, 1);
			} else {
				item1.resizeInnerContainers(isVertical, change, 0);
				item2.resizeInnerContainers(isVertical, change, 1);
			}
		}		
	}
}

export {
	TrussLayout as
	default
};