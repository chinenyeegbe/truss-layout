import {_addStyle, _createElement} from './utils.js' ;
class CircularButton {
	/**
	 * @constructor
	 * config object will contain content type of the button
	 * 
	 **/
	constructor(_parent, config) {
		this.parentElement = _parent;
		this.config = config;
		this.node = null;
	}

	_config () {
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
			'img' : {
				display: 'block',
				width: '76%',
				padding: '12%',
				height: 'auto'
			},
			'div' : {
				display: 'block',
				width: '30px',
				height: '30px'
			}
		};
	}

	_createButton (conf) {
		if(!conf.type) {
			conf.type = 'a';
		} else if (conf.type === 'svg') {
			conf.type = 'div';
		}
		let outer = _createElement('div'),
			middle = _createElement('div'),
			inner = _createElement(conf.type), // depends on the content
			config = this._config();
		
		_addStyle(outer, config['round-button']);
		_addStyle(middle, config['round-button-circle']);
		_addStyle(middle, {
			background: this.config.configuration.buttonBackgroung,
			color: this.config.configuration.buttonTextColor,
		});
		_addStyle(inner, config[conf.type]); //@todo change it as given type

		switch (conf.type) {
			case 'a' : inner.href = conf.href || '#'; inner.innerHTML = conf.innerHTML.toUpperCase() || 'TL'; break;
			case 'img' : inner.src = conf.src || ''; break;
			case 'div' : inner.innerHTML = conf.html || ''; break;
		}

		outer.appendChild(middle);
		middle.appendChild(inner);

		return outer;
	}

	// after redering buttons chart will be rendered for better space management
	render () {
		let config = this.config,
			position = config.position || {top: 0, left:0},
			contentConf = config.content,
			button = this.node = this._createButton(contentConf);
		
		_addStyle(button, position);

		this.parentElement.appendChild(button);
		return this;
	}

	getNode () {
		return this.node;
	}
}

export {CircularButton as default};