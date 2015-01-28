
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');
	
	var group = dom.create('table', {
		class: this.settings.styleprefix + 'Header' + (e.stylesuffix?e.stylesuffix:'')
	});
	this.container.appendChild(group, e);
	return {'element': group, 'select': e.select, 'multiselect': e.multiselect};
}
