// import Grid from './grid.js';

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
			this.gridList[this.elementCounter - 1] = grid;
		}

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

		for(let i = 0; i < 2; i++) {
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

	render() {

	}
}

// export {TrussLayout as default};