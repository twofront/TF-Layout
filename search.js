
var dom = require('../tfdom');

module.exports = exports = function(container) {
	this.container = container;
}

exports.prototype.setField = function(field) {
	var that = this;
	dom.on(field, 'keyup', function() {
		for (var i=0; i<that.container.childNodes.length; i++) {
			var n = that.container.childNodes[i];
			if (n.innerHTML.toLowerCase().indexOf(field.value) !== -1) {
				n.style.display = 'table-row';
			} else {
				n.style.display = 'none';
			}
		}
	});
}
