
var dom = require('tfdom');
var Search = require('./search.js');

module.exports = exports = function(settings) {
	this.settings = settings ? settings : {};
	if (this.settings.styleprefix === undefined) this.settings.styleprefix = '';
	this.events = {};
	this.templates = {};
};


exports.prototype.build = function(data) {
	this.container = dom.create('div', {
		class: this.settings.styleprefix + 'Container'
	});
	generateChildren.call(this, data);
	return this.container;
};

exports.prototype.on = function(ev, callback) {
	if (!this.events[ev]) this.events[ev] = [];
	this.events[ev].push(callback);
}

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
			this.table = createGroup.call(this, e);
			if (e.searchable) {
				var s = new Search(this.table);
				var searchField = createInput.call(this, {placeholder: 'Search', colspan: 2});
				s.setField(searchField);
			}
			if (e.contents) generateChildren.call(this, e.contents);
			this.table = null;
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

function addClickEvent(eventname, domelement, data) {
	if (data) {
		(function(that, data) {
			domelement.addEventListener('click', function() {
				if (that.events[eventname]) {
					var els = that.events[eventname];
					for (var i=0; i<els.length; i++) {
						els[i](data);
					}
				}
			});
		})(this, data);
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
	addClickEvent.call(this, 'rowclick', row, e.rowclick);
	if (!table) {
		table = createGroup.call(this, e);
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
	addClickEvent.call(this, 'columnclick', column, e.columnclick);
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
	var tcolumn = this.column;
	var column = tcolumn;
	if (!column) {
		column = createColumn.call(this, e);
	}
	var txt = document.createTextNode(e.value);
	column.appendChild(txt);
	if (e.editable) {
		if (!tcolumn) this.column = column;
		var inp = createInput.call(this, e);
		inp.style.display = 'none';
		this.column = tcolumn;
		dom.on(this.column, 'click', function() {
			inp.style.display = 'inline-block';
		});
	}
	return txt;
}

exports.prototype.template = function(name, value) {
	// Ensure we have an array of elements for consistency, rather than a single element with children.
	if (!Array.isArray(value)) value = [value];
	// Convert the template to a string so we can use regex later to substitute places the #s.
	this.templates[name] = JSON.stringify(value);
};
