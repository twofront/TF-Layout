
var TFLayout = require('../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('forminput', {type: 'row', contents: [
	{type: 'text', value: '#name'},
	{type: 'input', subtype: '#subtype', inputsubmit: '#id', value: '#value'}
]});

var ele = tfl.build([
	{type: 'row', rowclick: 'You clicked a row!', contents: [
		{type: 'text', value: 'Time', columnclick: 'You clicked a column!'},
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

tfl.on('columnclick', function(data) {
	alert(data);
});
tfl.on('rowclick', function(data) {
	alert(data);
});

document.body.appendChild(ele);
