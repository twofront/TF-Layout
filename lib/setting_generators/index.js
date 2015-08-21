/*	# Setting Generators

	The following settings are not included as they operate at the base-system level:

	* type
	* contents
*/

var generators = {
	'onclick': {
		'implementation': require('./onclick'),
		'tags': ['column', 'row', 'group', 'input']
	},
	'oncontext': {
		'implementation': require('./oncontext'),
		'tags': ['column']
	},
	'search': {
		'implementation': require('./search'),
		'tags': ['input']
	},
	'sort': {
		'implementation': require('./sort'),
		'tags': ['column']
	},
	'dragsort': {
		'implementation': require('./dragsort'),
		'tags': ['row']
	},
	'select': {
		'implementation': require('./select'),
		'tags': ['row']
	},
	'multiselect': {
		'implementation': require('./multiselect'),
		'tags': ['row']
	}
	/*'columnflow': {
		'implementation': require('./columnflow'),
		'tags': ['group']
	},
	'displaygroup': {
		'implementation': require('./displaygroup'),
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
	for (var e in generators) {
		if ((data[e] || (this.group && this.group[e])) && generators[e].tags.indexOf(tagType) !== -1) {
			generators[e].implementation.call(this, ele, data);
		}
	}
}
