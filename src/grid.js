// import TrussLayout from './manager.js';

class Grid {
	constructor(_parent) {
		this.parentElement = _parent;
		this.childGrids = {};
		this.buttons = {};
		this.dimensions = {};
		this.buttonCounter = 0;
	}

	static defaultConfig () {
		return {
			background: getRandomColor(),
			float: 'left',
			position: 'relative'
		}
	}

	_config () {
		return Object.assign({}, Grid.defaultConfig(), this.dimensions);
	}

	setDimensions (_dim) {
		this.dimensions = _dim;
		return this;
	}

	_createDiv (id) {
		let elem = document.createElement('div');
		
		this.id = elem.id = id;
		_addStyle(elem, this._config());

		this.parentElement && this.parentElement.appendChild(elem);
		this.node = elem;
		return elem;
	}

	removeDiv () {

	}

	getNode () {
		return this.node;
	}

	createSplit (split, cb) {
		let splitLayout = this.splitLayout = new TrussLayout(this.node);
		splitLayout.createSplit(split, cb);
	}
	// return id of the grid
	getId () {
		return this.node.id;
	}

	addButton (contentConf) {
		let config = {
				position: this._getButtonConfig(), 
				content: contentConf
			},
			id = `${this.getId()}Button${this.buttonCounter}`,
			btn = this.buttons[id] = new CircularButton(this.getNode(), config);

		btn.render();
	}

	render () {

	}

	_getButtonConfig() {
		return {};
	}
}

// export default Grid;