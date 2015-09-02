
module.exports = function(domelement, e) {
	(function(that, domelement, data) {
		var name = data.name
		domelement.addEventListener('change', function() {
			that.emit('change', {
				'name': name,
				'value': domelement.value
			});
		});
	})(this, domelement, e);
}
