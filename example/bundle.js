(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tfdom.js":[function(require,module,exports){

module.exports = {
	'get': function(id) {
		if (arguments.length === 1) {
			return document.getElementById(id);
		} else {
			var eles = {};
			for (var i=0; i<arguments.length; i++) {
				eles[arguments[i]] = document.getElementById(arguments[i]);
			}
			return eles;
		}
	},
	'create': function(tag, info) {
		var tg = document.createElement(tag);
		if (info) {
			for (var e in info) {
				if (e === 'innerHTML' || e === 'innerText' || e === 'children' || e === 'parent') {
					continue;
				}
				tg.setAttribute(e, info[e]);
			}
			if (info.innerHTML) {
				tg.innerHTML = info.innerHTML;
			}
			if (info.innerText) {
				tg.appendChild(document.createTextNode(info.innerText));
			}
			if (info.children) {
				for (var i=0; i<info.children.length; i++) {
					tg.appendChild(info.children[i]);
				}
			}
			if (info.parent) {
				info.parent.appendChild(tg);
			}
		}
		return tg;
	},
	'on': function(ele, event, action, downtree) {
		if (!downtree) downtree = false;
		if (event === 'click' && "ontouchstart" in document.documentElement) {
			ele.addEventListener('touchend', action, downtree);
		} else {
			ele.addEventListener(event, action, downtree);
		}
	}
}

},{}],"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tflayout/example/index.js":[function(require,module,exports){

var TFLayout = require('../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('forminput', {type: 'row', contents: [
	{type: 'text', value: '#name'},
	{type: 'input', subtype: '#subtype', value: '#value'}
]});

var tbl = tfl.build([
	{type: 'group', searchable: true, contents: [
		{type: 'text', stylename: 'Header', value: 'ID'},
		{type: 'forminput', name: 'Username', value: 'tjbaron'},
		{type: 'forminput', subtype: 'password', name: 'Password'},
		{type: 'input', subtype: 'button', value: 'Go!'}
	]}
]);

document.body.appendChild(tbl);

},{"../":"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tflayout/index.js"}],"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tflayout/index.js":[function(require,module,exports){

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

},{"../tfdom":"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tfdom.js","./search.js":"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tflayout/search.js"}],"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tflayout/search.js":[function(require,module,exports){

var dom = require('../tfdom');

module.exports = exports = function(container) {
	this.container = container;
}

exports.prototype.setField = function(field) {
	var that = this;
	dom.on(field, 'keyup', function() {
		for (var i=0; i<that.container.childNodes.length; i++) {
			var n = that.container.childNodes[i];
			if (n.innerHTML.toLowerCase().indexOf(field.value) !== -1) {
				n.style.display = 'table-row';
			} else {
				n.style.display = 'none';
			}
		}
	});
}

},{"../tfdom":"/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tfdom.js"}]},{},["/Users/Thomas/Current/Unpaid/TF Unite/client_scripts/lib/tflayout/example/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi90ZmRvbS5qcyIsImluZGV4LmpzIiwiLi4vaW5kZXguanMiLCIuLi9zZWFyY2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0J2dldCc6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBlbGVzID0ge307XG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8YXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGVsZXNbYXJndW1lbnRzW2ldXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFyZ3VtZW50c1tpXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZWxlcztcblx0XHR9XG5cdH0sXG5cdCdjcmVhdGUnOiBmdW5jdGlvbih0YWcsIGluZm8pIHtcblx0XHR2YXIgdGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cdFx0aWYgKGluZm8pIHtcblx0XHRcdGZvciAodmFyIGUgaW4gaW5mbykge1xuXHRcdFx0XHRpZiAoZSA9PT0gJ2lubmVySFRNTCcgfHwgZSA9PT0gJ2lubmVyVGV4dCcgfHwgZSA9PT0gJ2NoaWxkcmVuJyB8fCBlID09PSAncGFyZW50Jykge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRnLnNldEF0dHJpYnV0ZShlLCBpbmZvW2VdKTtcblx0XHRcdH1cblx0XHRcdGlmIChpbmZvLmlubmVySFRNTCkge1xuXHRcdFx0XHR0Zy5pbm5lckhUTUwgPSBpbmZvLmlubmVySFRNTDtcblx0XHRcdH1cblx0XHRcdGlmIChpbmZvLmlubmVyVGV4dCkge1xuXHRcdFx0XHR0Zy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpbmZvLmlubmVyVGV4dCkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGluZm8uY2hpbGRyZW4pIHtcblx0XHRcdFx0Zm9yICh2YXIgaT0wOyBpPGluZm8uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR0Zy5hcHBlbmRDaGlsZChpbmZvLmNoaWxkcmVuW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGluZm8ucGFyZW50KSB7XG5cdFx0XHRcdGluZm8ucGFyZW50LmFwcGVuZENoaWxkKHRnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHRnO1xuXHR9LFxuXHQnb24nOiBmdW5jdGlvbihlbGUsIGV2ZW50LCBhY3Rpb24sIGRvd250cmVlKSB7XG5cdFx0aWYgKCFkb3dudHJlZSkgZG93bnRyZWUgPSBmYWxzZTtcblx0XHRpZiAoZXZlbnQgPT09ICdjbGljaycgJiYgXCJvbnRvdWNoc3RhcnRcIiBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcblx0XHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGFjdGlvbiwgZG93bnRyZWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgYWN0aW9uLCBkb3dudHJlZSk7XG5cdFx0fVxuXHR9XG59XG4iLCJcbnZhciBURkxheW91dCA9IHJlcXVpcmUoJy4uLycpO1xuXG52YXIgdGZsID0gbmV3IFRGTGF5b3V0KHtcblx0c3R5bGVwcmVmaXg6ICdURkwtJ1xufSk7XG5cbnRmbC50ZW1wbGF0ZSgnZm9ybWlucHV0Jywge3R5cGU6ICdyb3cnLCBjb250ZW50czogW1xuXHR7dHlwZTogJ3RleHQnLCB2YWx1ZTogJyNuYW1lJ30sXG5cdHt0eXBlOiAnaW5wdXQnLCBzdWJ0eXBlOiAnI3N1YnR5cGUnLCB2YWx1ZTogJyN2YWx1ZSd9XG5dfSk7XG5cbnZhciB0YmwgPSB0ZmwuYnVpbGQoW1xuXHR7dHlwZTogJ2dyb3VwJywgc2VhcmNoYWJsZTogdHJ1ZSwgY29udGVudHM6IFtcblx0XHR7dHlwZTogJ3RleHQnLCBzdHlsZW5hbWU6ICdIZWFkZXInLCB2YWx1ZTogJ0lEJ30sXG5cdFx0e3R5cGU6ICdmb3JtaW5wdXQnLCBuYW1lOiAnVXNlcm5hbWUnLCB2YWx1ZTogJ3RqYmFyb24nfSxcblx0XHR7dHlwZTogJ2Zvcm1pbnB1dCcsIHN1YnR5cGU6ICdwYXNzd29yZCcsIG5hbWU6ICdQYXNzd29yZCd9LFxuXHRcdHt0eXBlOiAnaW5wdXQnLCBzdWJ0eXBlOiAnYnV0dG9uJywgdmFsdWU6ICdHbyEnfVxuXHRdfVxuXSk7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGJsKTtcbiIsIlxudmFyIGRvbSA9IHJlcXVpcmUoJy4uL3RmZG9tJyk7XG52YXIgU2VhcmNoID0gcmVxdWlyZSgnLi9zZWFyY2guanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcblx0dGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzID8gc2V0dGluZ3MgOiB7fTtcblx0aWYgKHNldHRpbmdzLnN0eWxlcHJlZml4ID09PSB1bmRlZmluZWQpIHNldHRpbmdzLnN0eWxlcHJlZml4ID0gJyc7XG5cblx0dGhpcy50ZW1wbGF0ZXMgPSB7fTtcbn07XG5cblxuZXhwb3J0cy5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuY29udGFpbmVyID0gZG9tLmNyZWF0ZSgnZGl2Jywge1xuXHRcdGNsYXNzOiB0aGlzLnNldHRpbmdzLnN0eWxlcHJlZml4ICsgJ0NvbnRhaW5lcidcblx0fSk7XG5cdHRoaXMudGFibGUgPSBkb20uY3JlYXRlKCd0YWJsZScsIHtcblx0XHRjbGFzczogdGhpcy5zZXR0aW5ncy5zdHlsZXByZWZpeCArICdUYWJsZSdcblx0fSk7XG5cdGdlbmVyYXRlQ2hpbGRyZW4uY2FsbCh0aGlzLCBkYXRhKTtcblx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50YWJsZSk7XG5cdHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ2hpbGRyZW4oZGF0YSkge1xuXHRmb3IgKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlID0gZGF0YVtpXTtcblx0XHRpZiAodGhpcy50ZW1wbGF0ZXNbZS50eXBlXSkge1xuXHRcdFx0dmFyIHQgPSB0aGlzLnRlbXBsYXRlc1tlLnR5cGVdO1xuXHRcdFx0Zm9yICh2YXIgZiBpbiBlKSB7XG5cdFx0XHRcdGlmIChmICE9PSAndHlwZScpIHQgPSB0LnJlcGxhY2UoJyMnK2YsIGVbZl0pO1xuXHRcdFx0fVxuXHRcdFx0Ly8gUmVwbGFjZSBhbnkgdmFyaWFibGVzIHRoYXQgd2VyZW4ndCB1c2VkIHdpdGggYW4gZW1wdHkgc3RyaW5nLlxuXHRcdFx0dCA9IHQucmVwbGFjZSgvXFwjKFthLXpBLVpfXSspL2csICcnKTtcblx0XHRcdHQgPSBKU09OLnBhcnNlKHQpO1xuXHRcdFx0Ly8gU3BsaWNlIHRha2VzIGEgbGlzdCBvZiBlbGVtZW50cyB0byBzcGxpY2UgaW4gcmF0aGVyIHRoYW4gYW4gYXJyYXkuIFdlIHVzZSBgYXBwbHlgIHRvXG5cdFx0XHQvLyBnZXQgYXJvdW5kIHRoaXMuXG5cdFx0XHR0ID0gW2ksIDFdLmNvbmNhdCh0KTtcblx0XHRcdEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoZGF0YSwgdCk7XG5cdFx0XHRlID0gZGF0YVtpXTtcblx0XHR9XG5cblx0XHRpZiAoZS50eXBlID09PSAnZ3JvdXAnKSB7XG5cdFx0XHQvLyBSaWdodCBub3cgZ3JvdXBzIGFyZSBncm91cHMgb2Ygcm93cyAoYSB0Ym9keSkuLi4gVGhleSBzaG91bGQgYmUgYSBzZXBhcmF0ZSB0YWJsZS5cblx0XHRcdHRoaXMuZ3JvdXAgPSBjcmVhdGVHcm91cC5jYWxsKHRoaXMsIGUpO1xuXHRcdFx0aWYgKGUuc2VhcmNoYWJsZSkge1xuXHRcdFx0XHR2YXIgcyA9IG5ldyBTZWFyY2godGhpcy5ncm91cCk7XG5cdFx0XHRcdHZhciBzZWFyY2hGaWVsZCA9IGRvbS5jcmVhdGUoJ2lucHV0Jyk7XG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlYXJjaEZpZWxkKTtcblx0XHRcdFx0cy5zZXRGaWVsZChzZWFyY2hGaWVsZCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZS5jb250ZW50cykgZ2VuZXJhdGVDaGlsZHJlbi5jYWxsKHRoaXMsIGUuY29udGVudHMpO1xuXHRcdFx0dGhpcy5ncm91cCA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChlLnR5cGUgPT09ICdyb3cnKSB7XG5cdFx0XHQvLyBXaGVuIGEgUm93IGlzIGV4cGxpY2l0bHkgY3JlYXRlZCB3ZSBrZWVwIGEgcmVmZXJlbmNlIG9mIGl0IGZvciBhbGwgaXRzIGNoaWxkcmVuIHRvIHVzZS5cblx0XHRcdC8vIFVubGlrZSBpbXBsaWNpdGx5IGNyZWF0ZWQgUm93cywgdGhlc2UgY2FuIGhhdmUgbXVsdGlwbGUgQ29sdW1ucy5cblx0XHRcdHRoaXMucm93ID0gY3JlYXRlUm93LmNhbGwodGhpcywgZSk7XG5cdFx0XHRpZiAoZS5jb250ZW50cykgZ2VuZXJhdGVDaGlsZHJlbi5jYWxsKHRoaXMsIGUuY29udGVudHMpO1xuXHRcdFx0dGhpcy5yb3cgPSBudWxsO1xuXHRcdH0gZWxzZSBpZiAoZS50eXBlID09PSAnY29sdW1uJykge1xuXHRcdFx0dGhpcy5jb2x1bW4gPSBjcmVhdGVDb2x1bW4uY2FsbCh0aGlzLCBlKTtcblx0XHRcdGlmIChlLmNvbnRlbnRzKSBnZW5lcmF0ZUNoaWxkcmVuLmNhbGwodGhpcywgZS5jb250ZW50cyk7XG5cdFx0XHR0aGlzLmNvbHVtbiA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChlLnR5cGUgPT09ICdpbnB1dCcpIHtcblx0XHRcdGNyZWF0ZUlucHV0LmNhbGwodGhpcywgZSk7XG5cdFx0fSBlbHNlIGlmIChlLnR5cGUgPT09ICd0ZXh0Jykge1xuXHRcdFx0Y3JlYXRlVGV4dC5jYWxsKHRoaXMsIGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVHcm91cChlKSB7XG5cdHZhciBncm91cCA9IGRvbS5jcmVhdGUoJ3Rib2R5Jywge1xuXHRcdGNsYXNzOiB0aGlzLnNldHRpbmdzLnN0eWxlcHJlZml4ICsgJ0dyb3VwJ1xuXHR9KTtcblx0dGhpcy50YWJsZS5hcHBlbmRDaGlsZChncm91cCk7XG5cdHJldHVybiBncm91cDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUm93KGUpIHtcblx0dmFyIGhvbGRlciA9IHRoaXMudGFibGU7XG5cdHZhciByb3cgPSBkb20uY3JlYXRlKCd0cicsIHtcblx0XHRjbGFzczogdGhpcy5zZXR0aW5ncy5zdHlsZXByZWZpeCArICdSb3cnXG5cdH0pO1xuXHRpZiAodGhpcy5ncm91cCkge1xuXHRcdGhvbGRlciA9IHRoaXMuZ3JvdXA7XG5cdH1cblx0aG9sZGVyLmFwcGVuZENoaWxkKHJvdyk7XG5cdHJldHVybiByb3c7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbHVtbihlKSB7XG5cdHZhciByb3cgPSB0aGlzLnJvdztcblx0dmFyIGNvbHVtbiA9IGRvbS5jcmVhdGUoJ3RkJywge1xuXHRcdGNsYXNzOiB0aGlzLnNldHRpbmdzLnN0eWxlcHJlZml4ICsgKGUuc3R5bGVuYW1lP2Uuc3R5bGVuYW1lOidDb2x1bW4nKVxuXHR9KTtcblx0Ly8gV2hlbiB3ZSBhZGQgYSBDb2x1bW4gb3V0c2lkZSBvZiBhbnkgUm93IHdlIGltcGxpY2l0bHkgY3JlYXRlIGEgUm93IGZvciB0aGlzIDEgQ29sdW1uIG9ubHkuXG5cdGlmICghcm93KSB7XG5cdFx0cm93ID0gY3JlYXRlUm93LmNhbGwodGhpcyk7XG5cdH1cblx0cm93LmFwcGVuZENoaWxkKGNvbHVtbik7XG5cdHJldHVybiBjb2x1bW47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0KGUpIHtcblx0dmFyIGNvbHVtbiA9IHRoaXMuY29sdW1uO1xuXHQvLyBXaGVuIHdlIGFkZCBhbiBJbnB1dCBvdXRzaWRlIG9mIGFueSBDb2x1bW4gd2UgaW1wbGljaXRseSBjcmVhdGUgYSBDb2x1bW4gZm9yIHRoaXMgMSBJbnB1dCBvbmx5LlxuXHRpZiAoIWNvbHVtbikge1xuXHRcdGNvbHVtbiA9IGNyZWF0ZUNvbHVtbi5jYWxsKHRoaXMsIHt9KTtcblx0fVxuXHR2YXIgaW5wID0gZG9tLmNyZWF0ZSgnaW5wdXQnLCB7XG5cdFx0J3R5cGUnOiBlLnN1YnR5cGUgPyBlLnN1YnR5cGUgOiAndGV4dCcsXG5cdFx0J3ZhbHVlJzogZS52YWx1ZSA/IGUudmFsdWUgOiAnJ1xuXHR9KTtcblx0Y29sdW1uLmFwcGVuZENoaWxkKGlucCk7XG5cdHJldHVybiBpbnA7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRleHQoZSkge1xuXHR2YXIgY29sdW1uID0gdGhpcy5jb2x1bW47XG5cdGlmICghY29sdW1uKSB7XG5cdFx0Y29sdW1uID0gY3JlYXRlQ29sdW1uLmNhbGwodGhpcywgZSk7XG5cdH1cblx0dmFyIHR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGUudmFsdWUpO1xuXHRjb2x1bW4uYXBwZW5kQ2hpbGQodHh0KTtcblx0cmV0dXJuIHR4dDtcbn1cblxuZXhwb3J0cy5wcm90b3R5cGUudGVtcGxhdGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuXHQvLyBFbnN1cmUgd2UgaGF2ZSBhbiBhcnJheSBvZiBlbGVtZW50cyBmb3IgY29uc2lzdGVuY3ksIHJhdGhlciB0aGFuIGEgc2luZ2xlIGVsZW1lbnQgd2l0aCBjaGlsZHJlbi5cblx0aWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBbdmFsdWVdO1xuXHQvLyBDb252ZXJ0IHRoZSB0ZW1wbGF0ZSB0byBhIHN0cmluZyBzbyB3ZSBjYW4gdXNlIHJlZ2V4IGxhdGVyIHRvIHN1YnN0aXR1dGUgcGxhY2VzIHRoZSAjcy5cblx0dGhpcy50ZW1wbGF0ZXNbbmFtZV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG59O1xuIiwiXG52YXIgZG9tID0gcmVxdWlyZSgnLi4vdGZkb20nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG5cdHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xufVxuXG5leHBvcnRzLnByb3RvdHlwZS5zZXRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkKSB7XG5cdHZhciB0aGF0ID0gdGhpcztcblx0ZG9tLm9uKGZpZWxkLCAna2V5dXAnLCBmdW5jdGlvbigpIHtcblx0XHRmb3IgKHZhciBpPTA7IGk8dGhhdC5jb250YWluZXIuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIG4gPSB0aGF0LmNvbnRhaW5lci5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0aWYgKG4uaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWVsZC52YWx1ZSkgIT09IC0xKSB7XG5cdFx0XHRcdG4uc3R5bGUuZGlzcGxheSA9ICd0YWJsZS1yb3cnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG4iXX0=
