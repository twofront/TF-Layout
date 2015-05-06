
var TFLayout = require('../../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('simpleheader', {type: 'header', contents: [
	{type: 'row', sort: '#sort', contents: [
		{type: 'text', value: '#value', stylesuffix: '-Header'}
	]}
]});

tfl.template('ttext', {type: 'row', contents: [
	{type: 'text', value: '#value'},
	{type: 'text', value: '#prop'}
]});

var ele = tfl.build([
	//{type: 'simpleheader', value: 'Nouns'},
	{type: 'input', search: ['Nouns','Pronouns','Verbs']},
	{type: 'input', subtype: 'text', name: 'Username', value: 'Us', placeholder: 'Username'},
	{type: 'header', contents: [
		{type: 'row', sort: 'Nouns', contents: [
			{type: 'text', value: 'Nouns', stylesuffix: '-Header'},
			{type: 'text', value: 'Properties', stylesuffix: '-Header'}
		]}
	]},
	{type: 'group', id: 'Nouns', name: 'Nouns', onclick: 'tagselect', multiselect: true, contents: [
		{type: 'ttext', value: 'Couch', prop: 'Furniture'},
		{type: 'ttext', value: 'Desk', prop: 'Furniture'},
		{type: 'ttext', value: 'Table', prop: 'Furniture'},
		{type: 'ttext', value: 'Zeebra', prop: 'Animal'}
	]},
	{type: 'simpleheader', value: 'Pronouns', sort: 'Pronouns'},
	{type: 'group', id: 'Pronouns', name: 'Pronouns', onclick: 'tagselect', multiselect: true, contents: [
		{type: 'text', value: 'I'},
		{type: 'text', value: 'Me'},
		{type: 'text', value: 'Us'},
		{type: 'text', value: 'You'}
	]},
	{type: 'simpleheader', value: 'Verbs', sort: 'Verbs'},
	{type: 'group', id: 'Verbs', name: 'Verbs', onclick: 'tagselect', multiselect: true, contents: [
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

tfl.on('click', function(param) {
	tfl.filter('Nouns', function(rowdata) {
		return rowdata.toLowerCase()==='yellow' ? true : false;
	});
	alert(JSON.stringify(tfl.getdata()));
});

document.body.appendChild(ele);
