
var dom = require('tfdom');

module.exports = function(domelement, data) {
	var group = this.group;
	var el = {'element': domelement, 'value': data.value};
	dom.on(domelement, 'click', function() {
		if (group.value) group.value.element.setAttribute('class', data.defaultclass);
		domelement.setAttribute('class', data.defaultclass+' Selected');
		group.value = el;
	});
}
