
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');

	var group = dom.create('table', {
		class: this.settings.styleprefix + 'Table' + (e.stylesuffix?e.stylesuffix:'')
	});

	/*if (e.searchable) {
		var s = new Search(this.table.element);
		var searchField = createInput.call(this, {placeholder: 'Search', colspan: 2});
		s.setField(searchField.element);
	}*/

	this.container.appendChild(group, e);
	return {'element': group, 'select': e.select, 'multiselect': e.multiselect};
}
