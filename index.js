
var dom = require('tfdom');
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
	generateChildren.call(this, data);
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

		if (e.type === 'group' || e.type === 'header') {
			// Right now groups are groups of rows (a tbody)... They should be a separate table.
			var mainContainer = this.container;
			if (e.type === 'header') this.container = createColumn.call(this, e);
			this.table = createGroup.call(this, e);
			if (e.searchable) {
				var s = new Search(this.table);
				var searchField = createInput.call(this, {placeholder: 'Search', colspan: 2});
				s.setField(searchField);
			}
			if (e.contents) generateChildren.call(this, e.contents);
			this.table = null;
			this.container = mainContainer;
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
	var group = dom.create('table', {
		class: this.settings.styleprefix + 'Table' + (e.stylesuffix?e.stylesuffix:'')
	});
	this.container.appendChild(group, e);
	return group;
}

function createRow(e) {
	var table = this.table;
	var row = dom.create('tr', {
		class: this.settings.styleprefix + 'Row' + (e.stylesuffix?e.stylesuffix:'')
	});
	if (!table) {
		table = createGroup.call(this);
	}
	table.appendChild(row, e);
	return row;
}

function createColumn(e) {
	var row = this.row;
	var column = dom.create('td', {
		class: this.settings.styleprefix + 'Column' + (e.stylesuffix?e.stylesuffix:''),
		colspan: e.colspan ? e.colspan : 1
	});
	// When we add a Column outside of any Row we implicitly create a Row for this 1 Column only.
	if (!row) {
		row = createRow.call(this, e);
	}
	row.appendChild(column);
	return column;
}

function createInput(e) {
	var column = this.column;
	// When we add an Input outside of any Column we implicitly create a Column for this 1 Input only.
	if (!column) {
		column = createColumn.call(this, e);
	}
	var inp = dom.create('input', {
		'type': e.subtype ? e.subtype : 'text',
		'value': e.value ? e.value : '',
		'placeholder': e.placeholder ? e.placeholder : ''
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
