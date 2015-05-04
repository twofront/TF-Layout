
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');
	
	// This is necessary since it will hold the headers vertical space in the list if it has to move
	// to the fixed position header div.
	var headerholder = dom.create('div', {
		style: 'position: relative; z-index: 1;'
	});

	var group = dom.create('table', {
		parent: headerholder,
		class: this.settings.styleprefix + 'Header' + (e.stylesuffix?e.stylesuffix:'')
	});

	this.headerstack.push({
		holder: headerholder,
		header: group
	});

	this.container.appendChild(headerholder);
	return {'element': group};
}
