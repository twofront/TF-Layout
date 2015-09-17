
var dom = require('tfdom');
var tag_generators = require('./lib/tag_generators');

module.exports = exports = function(settings) {
	this.settings = settings ? settings : {};
	if (this.settings.styleprefix === undefined) this.settings.styleprefix = '';
	this.events = {};
	// Templates allow complex layout data to be simplified.
	this.templates = {};

	// This holds all the inputs or groups whose values will be outputted as form-like data.
	// All elements that specify a "name" are added.
	this.formdata = {};
	// This holds all elements that specifiy an "id".
	this.elements = {};
	this.displaygroups = {};
};

exports.prototype.build = function(data) {
	var that = this;

	this.container = dom.create('div', {
		class: this.settings.styleprefix + 'Container'
	});
	this.headerholder = dom.create('div', {
		style: 'position: absolute; top: 0px; left: 0px; overflow: hidden;'
	});
	this.headerstack = null;

	this.formdata = {};
	this.elements = {};
	this.displaygroups = {};

	generateChildren.call(this, data);
	
	if (this.settings.parent) {
		this.settings.parent.appendChild(this.container);
		this.settings.parent.appendChild(this.headerholder);
		this.settings.parent.ontouchmove = function(e) {
			e.stopPropagation();
		}
	} else {
		return this.container;
	}
};

exports.prototype.filter = function(id, filterFunction) {
	
};

exports.prototype.getdata = function() {
	var d = {};
	console.log(this.formdata);
	for (var e in this.formdata) {
		d[e] = this.formdata[e].value;
		// This is specific to `select` and `multiselect` groups...
		if (typeof(d[e]) === 'object' && d[e] !== null && d[e].value) d[e] = d[e].value;
		if (Array.isArray(d[e])) {
			var na = [];
			for (var i=0; i<d[e].length; i++) {
				na.push(d[e][i].value);
			}
			d[e] = na;
		}
	}
	return d;
};

exports.prototype.on = function(ev, callback) {
	if (!this.events[ev]) this.events[ev] = [];
	this.events[ev].push(callback);
};

exports.prototype.emit = function(ev, e) {
	if (this.events[ev]) {
		var evs = this.events[ev];
		for (var i=0; i<evs.length; i++) {
			evs[i](e);
		}
	}
};

exports.prototype.template = function(name, value) {
	// Ensure we have an array of elements for consistency, rather than a single element with children.
	if (!Array.isArray(value)) value = [value];
	// Convert the template to a string so we can use regex later to substitute places the #s.
	this.templates[name] = JSON.stringify(value);
};

function generateChildren(data) {
	for (var i=0; i<data.length; i++) {
		var e = data[i];
		// If this child is a template, generate the full JSON structure.
		if (this.templates[e.type]) {
			var t = this.templates[e.type];
			// Loop through property values and insert them in the template.
			for (var f in e) {
				if (f !== 'type') t = t.replace(new RegExp('#'+f, 'g'), e[f]);
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

		if (tag_generators[e.type]) {
			// `this` holds global settings, templates and the current row, columns, group etc (if they already
			// exist and don't need to be dynamically generated).
			// `e` holds the properties for this particular child and its own children.
			this[e.type] = tag_generators[e.type].call(this, e);
			if (e.contents) generateChildren.call(this, e.contents);
			this[e.type] = null;
		} else {
			console.log('TFLayout: Unknown type "'+e.type+'"');
		}
	}
}
