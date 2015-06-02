
var dom = require('tfdom');
var tag_generators = null;
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	var tag_generators = require('./');

	var group = dom.create('table', {
		class: this.settings.styleprefix + 'Table' + (e.stylesuffix?e.stylesuffix:'')
	});

	setting_generators.call(this, 'group', group, e);

	this.container.appendChild(group);
	var obj = {'element': group, 'rows': [], 'select': e.select, 'multiselect': e.multiselect, 'dragsort': e.dragsort, 'value': e.multiselect ? [] : null};
	if (e.id) this.elements[e.id] = obj;
	if (e.name) this.formdata[e.name] = obj;
	return obj;
}
