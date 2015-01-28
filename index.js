
var dom = require('tfdom');
var tag_generators = require('./lib/tag_generators');
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
