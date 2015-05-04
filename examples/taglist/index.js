
var TFLayout = require('../../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('simpleheader', {type: 'header', contents: [
	{type: 'text', value: '#value', stylesuffix: '-Header'}
]});

tfl.template('ttext', {type: 'row', onclick: 'tagselect', contents: [
	{type: 'text', value: '#value'},
	{type: 'text', value: '#prop'}
]});

var ele = tfl.build([
	//{type: 'simpleheader', value: 'Nouns'},
	{type: 'input', search: ['Nouns','Pronouns','Verbs']},
	{type: 'header', contents: [
		{type: 'row', contents: [
			{type: 'text', value: 'Nouns', stylesuffix: '-Header'},
			{type: 'text', value: 'Properties', stylesuffix: '-Header'}
		]}
	]},
	{type: 'group', id: 'Nouns', multiselect: true, contents: [
		{type: 'ttext', value: 'Couch', prop: 'Furniture'},
		{type: 'text', value: 'Desk'},
		{type: 'text', value: 'Table'},
		{type: 'text', value: 'Zeebra'}
	]},
	{type: 'simpleheader', value: 'Pronouns'},
	{type: 'group', id: 'Pronouns', multiselect: true, contents: [
		{type: 'text', value: 'I'},
		{type: 'text', value: 'Me'},
		{type: 'text', value: 'Us'},
		{type: 'text', value: 'You'}
	]},
	{type: 'simpleheader', value: 'Verbs'},
	{type: 'group', id: 'Verbs', multiselect: true, contents: [
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

tfl.on('click', function() {
	alert(JSON.stringify(tfl.getdata()));
});

document.body.appendChild(ele);
