
module.exports = function(domelement, e) {
	(function(that, data) {
		//domelement.setAttribute('draggable', true);

/*
		var callbackParam = data.onclick;
		data.onclick = null;
		domelement.addEventListener('click', function() {
			if (that.events['click']) {
				var els = that.events['click'];
				for (var i=0; i<els.length; i++) {
					els[i](callbackParam);
				}
			}
		});
*/
	})(this, e);
}
