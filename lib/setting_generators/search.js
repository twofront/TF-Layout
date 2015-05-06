
var dom = require('tfdom');

module.exports = function(domelement, data) {
	if (typeof(data.search) === 'string') data.search = [data.search];
	if (!domelement.getAttribute('placeholder')) domelement.setAttribute('placeholder', 'Search');
	(function(that, data) {
		dom.on(domelement, 'keyup', function() {
			for (var j=0; j<data.search.length; j++) {
				var searchgroup = that.elements[data.search[j]].element;
				for (var i=0; i<searchgroup.childNodes.length; i++) {
					var n = searchgroup.childNodes[i];
					if (n.innerHTML.toLowerCase().indexOf(domelement.value.toLowerCase()) !== -1) {
						n.style.display = 'table-row';
					} else {
						n.style.display = 'none';
					}
				}
			}
		});
	})(this, data);
}
