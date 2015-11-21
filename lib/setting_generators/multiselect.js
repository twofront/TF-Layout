
var dom = require('tfdom');

module.exports = function(domelement, data) {
	var group = this.group;
	data.value = {name: data.value, value: false};
	dom.on(domelement, 'click', function() {
		if (data.value.value) {
			domelement.setAttribute('class', data.defaultclass);
			data.value.value = false;
		} else {
			domelement.setAttribute('class', data.defaultclass+' Selected');
			data.value.value = true;
		}
	});
}
