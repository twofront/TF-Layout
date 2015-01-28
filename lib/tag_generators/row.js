
var dom = require('tfdom');
var tag_generators = null;
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	if (!tag_generators) tag_generators = require('./');

	var row = dom.create('tr', {
		class: this.settings.styleprefix + 'Row' + (e.stylesuffix?e.stylesuffix:'')
	});

	setting_generators.call(this, 'row', row, e);
	
	var table = this.table ? this.table : this.header;
	if (!table) {
		table = tag_generators['group'].call(this, e);
	}
	table.element.appendChild(row, e);

	return {'element': row};
}