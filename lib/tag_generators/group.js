
var dom = require('tfdom');
var tag_generators = null;
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	var tag_generators = require('./');

	e.defaultclass = this.settings.styleprefix + 'Table' + (e.stylesuffix?e.stylesuffix:'');
	var group = dom.create('table', {
		class: e.defaultclass
	});

	setting_generators.call(this, 'group', group, e);

	this.container.appendChild(group);
	var obj = {'element': group, 'rows': [], 'select': e.select, 'multiselect': e.multiselect, 'dragsort': e.dragsort, 'value': e.multiselect ? [] : null, 'defaultclass': e.defaultclass};
	if (e.id) this.elements[e.id] = obj;
	if (e.name) this.formdata[e.name] = obj;
	return obj;
}
