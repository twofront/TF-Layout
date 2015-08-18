
var dom = require('tfdom');

module.exports = function(domelement, data) {
	if (typeof(data.sort) === 'string') data.sort = [data.sort];
	var sortelement = dom.create('div', {
		innerHTML: 'Sort',
		style: 'position: relative; padding: 3px; float: right; font-size: 10px; height: 100%;'
	});
	(function(that, sortelement, data) {
		var direction = 1;
		dom.on(sortelement, 'click', function() {
			sortelement.innerHTML = direction===1 ? 'Sort v' : 'Sort ^';
			for (var i=0; i<data.sort.length; i++) {
				var g = that.elements[data.sort[i]];
				if (g) {
					g.rows.sort(function(a, b) {
						return a.element.innerHTML>b.element.innerHTML ? direction : -direction;
					});
					for (var j=0; j<g.rows.length; j++) {
						g.element.removeChild(g.rows[j].element);
						g.element.appendChild(g.rows[j].element);
					}
				}
			}
			direction = -direction;
		});
	})(this, sortelement, data);
	domelement.appendChild(sortelement);
}
