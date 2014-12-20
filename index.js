
var dom = require('../tfdom');
var Search = require('./search.js');

module.exports = exports = function(settings) {
	this.settings = settings ? settings : {};
	if (settings.styleprefix === undefined) settings.styleprefix = '';

	this.templates = {};
};


exports.prototype.build = function(data) {
	this.container = dom.create('div', {
		class: this.settings.styleprefix + 'Container'
	});
	this.table = dom.create('table', {
		class: this.settings.styleprefix + 'Table'
	});
	generateChildren.call(this, data);
	this.container.appendChild(this.table);
	return this.container;
};

function generateChildren(data) {
	for (var i=0; i<data.length; i++) {
		var e = data[i];
		if (this.templates[e.type]) {
			var t = this.templates[e.type];
			for (var f in e) {
				if (f !== 'type') t = t.replace('#'+f, e[f]);
			}
			// Replace any variables that weren't used with an empty string.
			t = t.replace(/\#([a-zA-Z_]+)/g, '');
			t = JSON.parse(t);
			// Splice takes a list of elements to splice in rather than an array. We use `apply` to
			// get around this.
			t = [i, 1].concat(t);
			Array.prototype.splice.apply(data, t);
			e = data[i];
		}

		if (e.type === 'group') {
			// Right now groups are groups of rows (a tbody)... They should be a separate table.
			this.group = createGroup.call(this, e);
			if (e.searchable) {
				var s = new Search(this.group);
				var searchField = dom.create('input');
				this.container.appendChild(searchField);
				s.setField(searchField);
			}
			if (e.contents) generateChildren.call(this, e.contents);
			this.group = null;
		} else if (e.type === 'row') {
			// When a Row is explicitly created we keep a reference of it for all its children to use.
			// Unlike implicitly created Rows, these can have multiple Columns.
			this.row = createRow.call(this, e);
			if (e.contents) generateChildren.call(this, e.contents);
			this.row = null;
		} else if (e.type === 'column') {
			this.column = createColumn.call(this, e);
			if (e.contents) generateChildren.call(this, e.contents);
			this.column = null;
		} else if (e.type === 'input') {
			createInput.call(this, e);
		} else if (e.type === 'text') {
			createText.call(this, e);
		}
	}
}

function createGroup(e) {
	var group = dom.create('tbody', {
		class: this.settings.styleprefix + 'Group'
	});
	this.table.appendChild(group);
	return group;
}

function createRow(e) {
	var holder = this.table;
	var row = dom.create('tr', {
		class: this.settings.styleprefix + 'Row'
	});
	if (this.group) {
		holder = this.group;
	}
	holder.appendChild(row);
	return row;
}

function createColumn(e) {
	var row = this.row;
	var column = dom.create('td', {
		class: this.settings.styleprefix + (e.stylename?e.stylename:'Column')
	});
	// When we add a Column outside of any Row we implicitly create a Row for this 1 Column only.
	if (!row) {
		row = createRow.call(this);
	}
	row.appendChild(column);
	return column;
}

function createInput(e) {
	var column = this.column;
	// When we add an Input outside of any Column we implicitly create a Column for this 1 Input only.
	if (!column) {
		column = createColumn.call(this, {});
	}
	var inp = dom.create('input', {
		'type': e.subtype ? e.subtype : 'text',
		'value': e.value ? e.value : ''
	});
	column.appendChild(inp);
	return inp;
}

function createText(e) {
	var column = this.column;
	if (!column) {
		column = createColumn.call(this, e);
	}
	var txt = document.createTextNode(e.value);
	column.appendChild(txt);
	return txt;
}

exports.prototype.template = function(name, value) {
	// Ensure we have an array of elements for consistency, rather than a single element with children.
	if (!Array.isArray(value)) value = [value];
	// Convert the template to a string so we can use regex later to substitute places the #s.
	this.templates[name] = JSON.stringify(value);
};
