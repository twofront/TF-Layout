
var TFLayout = require('../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('forminput', {type: 'row', contents: [
	{type: 'text', value: '#name'},
	{type: 'input', subtype: '#subtype', inputsubmit: '#id', value: '#value'}
]});

tfl.template('simpleheader', {type: 'header', contents: [
	{type: 'text', value: '#value', stylesuffix: '-Header', onclick: 'Title Clicked!'}
]});

var ele = tfl.build([
	{type: 'simpleheader', value: 'Entry Data'},
	{type: 'group', contents: [
		{type: 'forminput', name: 'Username', value: 'tjbaron'},
		{type: 'forminput', subtype: 'password', name: 'Password'},
	]},
	{type: 'simpleheader', value: 'Entry Tags'},
	{type: 'group', columns: 'fit', 'min-width': 200, multiselect: true, contents: [
		{type: 'text', value: 'Noun'},
		{type: 'text', value: 'Pronoun'},
		{type: 'text', value: 'Verb'},
		{type: 'text', value: 'Adverb'}
	]},
	{type: 'input', subtype: 'button', value: 'Save'}
]);

tfl.on('click', function(data) {
	alert(data);
});

document.body.appendChild(ele);
