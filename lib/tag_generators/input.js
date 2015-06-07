
var dom = require('tfdom');
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	var tag_generators = require('./');

	var inp;
	if (e.subtype === 'dropdown') {
		inp = dom.create('select', {
			'class': this.settings.styleprefix + 'Input' + (e.stylesuffix?e.stylesuffix:'')
		});
		if (e.options) {
			for (var i=0; i<e.options.length; i++) {
				var o = dom.create('option', {'innerHTML': ''});
			}
		}
	} else {
		inp = dom.create('input', {
			'type': e.subtype ? e.subtype : 'text',
			'value': e.value ? e.value : '',
			'placeholder': e.placeholder ? e.placeholder : '',
			'class': this.settings.styleprefix + 'Input' + (e.stylesuffix?e.stylesuffix:'')
		});
	}

	if (e.name) {
		this.formdata[e.name] = inp;
		// Since properties sent in e are recursively send down to auto-generated columns our id would
		// be assigned to the column if we didn't do this.
		e.name = null;
	}
	setting_generators.call(this, 'input', inp, e);

	var column = this.column;
	// When we add an Input outside of any Column we implicitly create a Column for this 1 Input only.
	if (!column) {
		column = tag_generators['column'].call(this, e);
	}
	column.element.appendChild(inp);

	return {'element': inp};
}
