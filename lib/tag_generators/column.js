
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');

	var defaultClass = this.settings.styleprefix + 'Column' + (e.stylesuffix?e.stylesuffix:'');
	var column = dom.create('td', {
		class: defaultClass,
		colspan: e.colspan ? e.colspan : 1
	});
	
	if (this.group && this.group.select) {
		new select(e, column, this.group, defaultClass);
	} else if (this.group && this.group.multiselect) {
		new multiselect(e, column, this.group, defaultClass);
	}

	// When we add a Column outside of any Row we implicitly create a Row for this 1 Column only.
	var row = this.row;
	if (!row) {
		row = tag_generators['row'].call(this, e);
	}
	row.element.appendChild(column);

	return {'element': column};
};

function select(e, c, t, defaultClass) {
	c.addEventListener('click', function() {
		if (t.selection) t.selection.setAttribute('class', defaultClass);
		c.setAttribute('class', defaultClass+' Selected');
		t.selection = c;
	});
}

function multiselect(e, c, t, defaultClass) {
	c.addEventListener('click', function() {
		if (!t.selection) t.selection = [];
		for (var i=0; i<t.selection.length; i++) {
			if (t.selection[i] === c) {
				t.selection.splice(i,1);
				c.setAttribute('class', defaultClass);
				return;
			}
		}
		t.selection.push(c);
		c.setAttribute('class', defaultClass+' Selected');
	});
}
