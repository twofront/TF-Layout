
var dom = require('tfdom');
var tag_generators = require('./lib/tag_generators');
var Search = require('./search.js');

module.exports = exports = function(settings) {
	this.settings = settings ? settings : {};
	if (this.settings.styleprefix === undefined) this.settings.styleprefix = '';
	this.events = {};
	// Templates allow complex layout data to be simplified.
	this.templates = {};
	// A stack of all headers used to decide which one sticks to the top and helps o it.
	this.headerstack = [];

	this.formdata = {};
	this.displaygroups = {};
};

exports.prototype.build = function(data) {
	var that = this;

	this.container = dom.create('div', {
		class: this.settings.styleprefix + 'Container'
	});
	this.headerholder = dom.create('div', {
		parent: this.container,
		style: 'position: fixed; top: 0px; left: 0px; overflow: hidden;'
	});

	this.container.addEventListener('scroll', function scrolled(e) {
		that.headerholder.style.left = -e.target.scrollLeft+'px';
		var topPos = e.target.scrollTop;
		if (that.activeheader) {
			that.activeheader.holder.appendChild(that.activeheader.header);
			that.activeheader.holder.style.height = null;
			that.activeheader = null;
		}
		for (var i=that.headerstack.length-1; i>=0; i--) {
			var h = that.headerstack[i];
			if (h.holder.offsetTop < topPos) {
				h.holder.style.height = h.holder.offsetHeight+'px';
				that.headerholder.appendChild(h.header);
				that.activeheader = h;
				return;
			}
		}
	});

	this.formdata = {};
	this.displaygroups = {};

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

exports.prototype.getdata = function() {
	var d = {};
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
