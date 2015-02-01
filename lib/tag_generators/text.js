
var dom = require('tfdom');

module.exports = function(e) {
	var tag_generators = require('./');
	
	var tcolumn = this.column;
	var column = tcolumn;
	if (!column) {
		column = tag_generators['column'].call(this, e);
	}
	var txt = document.createTextNode(e.value);
	column.element.appendChild(txt);
	if (e.editable) {
		if (!tcolumn) this.column = column;
		var inp = createInput.call(this, e);
		inp.style.display = 'none';
		this.column = tcolumn;
		dom.on(this.column.element, 'click', function() {
			inp.style.display = 'inline-block';
		});
	}
	return {'element': txt};
}
