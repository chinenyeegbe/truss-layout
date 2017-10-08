function getRandomColor () {
	let letters = '0123456789ABCDEF',
		color = '#';

	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

function _addStyle (elem, _config) {
	for(let i in _config) {
		elem.style[i] = _config[i];
	}
	return this;
};

function _createElement (type) {
	if (type && typeof type === 'string') {
		return document.createElement(type);
	}
	return false;
};

/**
* Rounds up a number to two decimal points.
* @param {Number} d - given number to round up
* @returns {Number} - rounded up number
*/ 
function roundUp (d) {
   return Math.round(d * 10) / 10;
}