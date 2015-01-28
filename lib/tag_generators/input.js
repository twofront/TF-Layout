
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');
	
	var column = this.column;
	// When we add an Input outside of any Column we implicitly create a Column for this 1 Input only.
	if (!column) {
		column = tag_generators['column'].call(this, e);
	}
	var inp = dom.create('input', {
		'type': e.subtype ? e.subtype : 'text',
		'value': e.value ? e.value : '',
		'placeholder': e.placeholder ? e.placeholder : ''
	});
	column.element.appendChild(inp);
	return {'element': inp};
}
