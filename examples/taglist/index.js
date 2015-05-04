
var TFLayout = require('../../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('simpleheader', {type: 'header', contents: [
	{type: 'text', value: '#value', stylesuffix: '-Header'}
]});

var ele = tfl.build([
	{type: 'simpleheader', value: 'Nouns'},
	{type: 'group', id: 'Nouns', multiselect: true, contents: [
		{type: 'text', value: 'Couch'},
		{type: 'text', value: 'Desk'},
		{type: 'text', value: 'Table'},
		{type: 'text', value: 'Zeebra'}
	]},
	{type: 'simpleheader', value: 'Pronouns'},
	{type: 'group', id: 'Nouns', multiselect: true, contents: [
		{type: 'text', value: 'I'},
		{type: 'text', value: 'Me'},
		{type: 'text', value: 'Us'},
		{type: 'text', value: 'You'}
	]},
	{type: 'simpleheader', value: 'Verbs'},
	{type: 'group', id: 'Nouns', multiselect: true, contents: [
		{type: 'text', value: 'Ate'},
		{type: 'text', value: 'Break'},
		{type: 'text', value: 'Crunch'},
		{type: 'text', value: 'Die'},
		{type: 'text', value: 'Fake'},
		{type: 'text', value: 'Hug'},
		{type: 'text', value: 'Jump'},
		{type: 'text', value: 'Leap'},
		{type: 'text', value: 'Mug'},
		{type: 'text', value: 'Open'},
		{type: 'text', value: 'Plop'},
		{type: 'text', value: 'Rest'}
	]}
]);

document.body.appendChild(ele);
