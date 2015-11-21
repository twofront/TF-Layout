
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
	var rows = [];
	var obj = {
		'element': group,
		'rows': rows,
		'value': rows,
		'defaultclass': e.defaultclass,
		'columnids': e.columnids,
		'childrows': e.childrows,

		'select': e.select,
		'multiselect': e.multiselect,
		'dragsort': e.dragsort,
		'oncontext': e.oncontext,
		'onclick': e.onclick
	};
	if (e.id) this.elements[e.id] = obj;
	if (e.name) this.formdata[e.name] = obj;
	return obj;
}
