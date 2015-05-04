
var dom = require('tfdom');
var setting_generators = require('../setting_generators');

module.exports = function(e) {
	var tag_generators = require('./');

	var inp;
	if (e.subtype === 'dropdown') {
		inp = dom.create('select');
		if (e.options) {
			for (var i=0; i<e.options.length; i++) {
				var o = dom.create('option', {'innerHTML': ''});
			}
		}
	} else {
		inp = dom.create('input', {
			'type': e.subtype ? e.subtype : 'text',
			'value': e.value ? e.value : '',
			'placeholder': e.placeholder ? e.placeholder : ''
		});
	}

	if (e.id) this.formdata[e.id] = inp;
	setting_generators.call(this, 'input', inp, e);

	var column = this.column;
	// When we add an Input outside of any Column we implicitly create a Column for this 1 Input only.
	if (!column) {
		column = tag_generators['column'].call(this, e);
	}
	column.element.appendChild(inp);

	return {'element': inp};
}
