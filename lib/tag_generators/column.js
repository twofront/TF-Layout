
var dom = require('tfdom');
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	var tag_generators = require('./');

	e.defaultclass = this.settings.styleprefix + 'Column' + (e.stylesuffix?e.stylesuffix:'');
	var column = dom.create('td', {
		innerHTML: e.html ? e.html : '',
		class: e.defaultclass,
		colspan: e.colspan ? e.colspan : 1
	});

	var obj = {'element': column};

	// When we add a Column outside of any Row we implicitly create a Row for this 1 Column only.
	var row = this.row;
	if (!row) {
		row = tag_generators['row'].call(this, e);
	}

	if (this.group && this.group.columnids && this.group.columnids.length > row.columns.length) {
		obj.id = e.id = this.group.columnids[row.columns.length];
	}
	if (row.sort) e.sort = row.sort;
	setting_generators.call(this, 'column', column, e);

	row.element.appendChild(column);
	row.columns.push(obj);

	return obj;
};
