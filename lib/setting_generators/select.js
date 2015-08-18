
var dom = require('tfdom');

module.exports = function(domelement, data) {
	dom.on(domelement, 'click', function() {
		if (this.group.value) domelement.setAttribute('class', data.defaultclass);
		domelement.setAttribute('class', data.defaultclass+' Selected');
		this.group.value = data.value;
	});
}
