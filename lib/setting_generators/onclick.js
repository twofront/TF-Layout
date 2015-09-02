
module.exports = function(domelement, e) {
	(function(that, data) {
		var row = that.row;
		var callbackParam = data.onclick;
		data.onclick = null;
		domelement.addEventListener('click', function() {
			that.emit('click', {
				'row': row ? row.value : null,
				'column': data.id,
				'value': data.value,
				'data': callbackParam
			});
		});
	})(this, e);
}
