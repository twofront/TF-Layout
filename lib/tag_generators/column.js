
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');

	var defaultClass = this.settings.styleprefix + 'Column' + (e.stylesuffix?e.stylesuffix:'');
	var row = this.row;
	var column = dom.create('td', {
		class: defaultClass,
		colspan: e.colspan ? e.colspan : 1
	});
	//addClickEvent.call(this, 'columnclick', column, e.columnclick);
	if (this.table && this.table.select) {
		(function(e, c, t, defaultClass) {
			c.addEventListener('click', function() {
				if (t.selection) t.selection.setAttribute('class', defaultClass);
				c.setAttribute('class', defaultClass+' Selected');
				t.selection = c;
			});
		})(e, column, this.table, defaultClass);
	} else if (this.table && this.table.multiselect) {
		(function(e, c, t, defaultClass) {
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
		})(e, column, this.table, defaultClass);
	}
	// When we add a Column outside of any Row we implicitly create a Row for this 1 Column only.
	if (!row) {
		row = tag_generators['row'].call(this, e);
	}
	row.element.appendChild(column);
	return {'element': column};
};
