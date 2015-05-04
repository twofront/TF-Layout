/*	# Setting Generators

	The following settings are not included as they operate at the base-system level:

	* type
	* contents
*/

var generators = {
	'onclick': {
		'implementation': require('./onclick'),
		'tags': ['column', 'row', 'input']
	}
	/*'columnflow': {
		'implementation': require('./columnflow'),
		'tags': ['group']
	},
	'displaygroup': {
		'implementation': require('./displaygroup'),
		'tags': ['group']
	},
	'search': {
		'implementation': require('./search'),
		'tags': ['group']
	},
	'stylesuffix': {
		'implementation': require('./stylesuffix'),
		'tags': ['column', 'row', 'group'],
		'bubble': true
	},
	'subtype': {
		'implementation': require('./subtype'),
		'tags': ['input']
	}*/
};

module.exports = function(tagType, ele, data) {
	for (var e in data) {
		if (data[e] && generators[e] && generators[e].tags.indexOf(tagType) !== -1) {
			generators[e].implementation.call(this, ele, data);
		}
	}
}
