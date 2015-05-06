
var dom = require('tfdom');
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	var tag_generators = require('./');

	var defaultClass = this.settings.styleprefix + 'Column' + (e.stylesuffix?e.stylesuffix:'');
	var column = dom.create('td', {
		class: defaultClass,
		colspan: e.colspan ? e.colspan : 1
	});
	
	if (this.group && this.group.select) {
		new select(e, {element:column, value:e.value}, this.group, defaultClass);
	} else if (this.group && this.group.multiselect) {
		new multiselect(e, {element:column, value:e.value}, this.group, defaultClass);
	}

	var obj = {'element': column};

	// When we add a Column outside of any Row we implicitly create a Row for this 1 Column only.
	var row = this.row;
	if (!row) {
		row = tag_generators['row'].call(this, e);
	}

	if (row.sort) e.sort = row.sort;
	setting_generators.call(this, 'column', column, e);

	row.element.appendChild(column);
	row.columns.push(obj);

	return obj;
};

function select(e, c, t, defaultClass) {
	c.element.addEventListener('click', function() {
		if (t.value) t.value.element.setAttribute('class', defaultClass);
		c.element.setAttribute('class', defaultClass+' Selected');
		t.value = c;
	});
}

function multiselect(e, c, t, defaultClass) {
	c.element.addEventListener('click', function() {
		if (!t.value) t.value = [];
		for (var i=0; i<t.value.length; i++) {
			if (t.value[i] === c) {
				t.value.splice(i,1);
				c.element.setAttribute('class', defaultClass);
				return;
			}
		}
		t.value.push(c);
		c.element.setAttribute('class', defaultClass+' Selected');
	});
}
