
var dom = require('tfdom');

module.exports = function(domelement, data) {
	var group = this.group;
	var el = {'element': domelement, 'value': data.value};
	dom.on(domelement, 'click', function() {
		if (!group.value) group.value = [];
		for (var i=0; i<group.value.length; i++) {
			if (group.value[i].value === data.value) {
				group.value.splice(i,1);
				domelement.setAttribute('class', data.defaultclass);
				return;
			}
		}
		group.value.push(el);
		domelement.setAttribute('class', data.defaultclass+' Selected');
	});
}
