
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');

	var group = dom.create('table', {
		class: this.settings.styleprefix + 'Table' + (e.stylesuffix?e.stylesuffix:'')
	});

	this.container.appendChild(group);
	var obj = {'element': group, 'select': e.select, 'multiselect': e.multiselect, 'value': e.multiselect ? [] : null};
	if (e.id) this.formdata[e.id] = obj;
	return obj;
}
