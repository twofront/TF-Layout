
var TFLayout = require('../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('forminput', {type: 'row', contents: [
	{type: 'text', value: '#name'},
	{type: 'input', subtype: '#subtype', value: '#value'}
]});

var tbl = tfl.build([
	{type: 'group', searchable: true, contents: [
		{type: 'text', stylename: 'Header', value: 'ID'},
		{type: 'forminput', name: 'Username', value: 'tjbaron'},
		{type: 'forminput', subtype: 'password', name: 'Password'},
		{type: 'input', subtype: 'button', value: 'Go!'}
	]}
]);

document.body.appendChild(tbl);
