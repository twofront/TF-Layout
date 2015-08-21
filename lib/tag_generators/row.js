
var dom = require('tfdom');
var tag_generators = null;
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	if (!tag_generators) tag_generators = require('./');

	e.defaultclass = this.settings.styleprefix + 'Row' + (e.stylesuffix?e.stylesuffix:'');
	var row = dom.create('tr', {
		class: e.defaultclass
	});

	var table = this.group ? this.group : this.header;
	if (!table) {
		table = tag_generators['group'].call(this, e);
	}

	if (table.dragsort) e.dragsort = table.dragsort;
	setting_generators.call(this, 'row', row, e);
	
	var obj = {
		'element': row,
		'columns': [],
		'defaultclass': e.defaultclass,
		'sort': e.sort,
		'value': e.value
	};

	table.element.appendChild(row);
	table.rows.push(obj);

	return obj;
}
