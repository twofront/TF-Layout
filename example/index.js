
var TFLayout = require('../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('forminput', {type: 'row', contents: [
	{type: 'text', value: '#name'},
	{type: 'input', subtype: '#subtype', value: '#value'}
]});

var tbl = tfl.build([
	{type: 'row', contents: [
		{type: 'text', value: 'Time'},
		{type: 'text', value: '4:30 AM'}
	]},
	{type: 'text', stylesuffix: '-Header', value: 'Area1'},
	{type: 'group', searchable: true, contents: [
		{type: 'forminput', name: 'Username', value: 'tjbaron'},
		{type: 'forminput', subtype: 'password', name: 'Password'},
		{type: 'input', subtype: 'button', value: 'Go!'}
	]},
	{type: 'text', stylesuffix: '-Header', value: 'Area2'},
	{type: 'group', searchable: true, contents: [
		{type: 'forminput', name: 'Username', value: 'tjbaron'},
		{type: 'forminput', subtype: 'password', name: 'Password'},
		{type: 'input', subtype: 'button', value: 'Go!'}
	]}
]);

document.body.appendChild(tbl);
