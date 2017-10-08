// import Grid from './grid.js';

class TrussLayout {
	constructor (elem) {
		this.gridList = {};
		this.elementCounter = 0;
		this.parent = elem;
	}

	config () {
		return {
			margin: 5,
			padding: 0
		}
	}

	_removeAllGrids () {
		for(let i in this.gridList) {
			this.parent.removeChild(this.gridList[i].getNode());
		}
		this.elementList = {};
		this.elementCounter = 0;
	}

	createSplit (splits, cb) {
		Object.keys(this.gridList).length > 1 && this._removeAllGrids();
		
		let rows = Number(splits[0]) || 1,
			columns = Number(splits[1]) || 1,
			parentElem = this.parent,
			conf = this.config(),
			parentHeight = parentElem.offsetHeight,
			parentWidth = parentElem.offsetWidth,
			margin = conf.margin,
			padding = conf.padding,
			calculatedHeight = (parentHeight / rows) - (margin * 2),
			calculatedWidth = (parentWidth / columns) - (margin * 2),
			numberOfDivs = rows * columns,
			config = {
				height : `${calculatedHeight}px`,
				width : `${calculatedWidth}px`,
				margin : `${margin}px`,
				padding : `${padding}px`
			};

		for(let i = 0; i < numberOfDivs; i++) {
			let grid = new Grid(parentElem),
				id = (parentElem.id || 'gridLayout') + this.elementCounter++;
			grid.setDimensions(config)._createDiv(id)._calculateMaxButton();
			this.gridList[id] = grid;
		}

		typeof cb === 'function' && cb.call(this, this.gridList);
		return this;
	}

	render () {

	}
}

// export {TrussLayout as default};