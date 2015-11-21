
var row = require('./row');
var group = require('./group');

module.exports = function(domelement, data, tagtype) {
	if (tagtype === 'row') row.call(this, domelement, data);
	if (tagtype === 'group') group.call(this, domelement, data);
}
