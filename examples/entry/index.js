
var TFLayout = require('../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('forminput', {type: 'row', contents: [
	{type: 'text', value: '#name'},
	{type: 'input', subtype: '#subtype', id: '#id', value: '#value'}
]});

tfl.template('simpleheader', {type: 'header', contents: [
	{type: 'text', value: '#value', stylesuffix: '-Header', onclick: 'Title Clicked!'}
]});

var ele = tfl.build([
	{type: 'simpleheader', value: 'Entry Data'},
	{type: 'group', contents: [
		{type: 'forminput', id: 'username', name: 'Username', value: 'tjbaron'},
		{type: 'forminput', id: 'password', subtype: 'password', name: 'Password'},
	]},
	{type: 'simpleheader', value: 'Entry Tags'},
	{type: 'group', id: 'speechpart', columns: 'fit', 'min-width': 200, multiselect: true, contents: [
		{type: 'text', value: 'Noun'},
		{type: 'text', value: 'Pronoun'},
		{type: 'text', value: 'Verb'},
		{type: 'text', value: 'Adverb'}
	]},
	{type: 'input', subtype: 'button', value: 'Save', onclick: 'Button Clicked!'}
]);

tfl.on('click', function(data) {
	alert(data);
	alert(JSON.stringify(tfl.getdata()));
});

document.body.appendChild(ele);
