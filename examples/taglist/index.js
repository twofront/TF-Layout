
var TFLayout = require('../../');

var tfl = new TFLayout({
	styleprefix: 'TFL-'
});

tfl.template('simpleheader', {type: 'header', contents: [
	{type: 'row', sort: '#sort', stylesuffix: '-Header', contents: [
		{type: 'text', value: '#value', stylesuffix: '-Header'}
	]}
]});

tfl.template('ttext', {type: 'row', value: '#value', contents: [
	{type: 'text', value: '#value'},
	{type: 'text', value: '#prop'}
]});

var ele = tfl.build([
	//{type: 'simpleheader', value: 'Nouns'},
	{type: 'input', search: ['Nouns','Pronouns','Verbs']},
	{type: 'input', subtype: 'text', name: 'Username', value: 'Us', placeholder: 'Username'},
	{type: 'header', contents: [
		{type: 'row', sort: 'Nouns', stylesuffix: '-Header', togglecolumns: true, contents: [
			{type: 'text', value: 'Nouns', stylesuffix: '-Header'},
			{type: 'text', value: 'Properties', stylesuffix: '-Header'}
		]}
	]},
	{type: 'group', id: 'Nouns', name: 'Nouns', onclick: 'tagselect', oncontext: ['Rename', 'Delete'], select: true, columnids: [
		'Noun', 'Type'
	], contents: [
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
	{type: 'group', id: 'Verbs', name: 'Verbs', onclick: 'tagselect', dragsort: true, select: true, contents: [
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
	]},
	{type: 'input', subtype: 'button', value: 'Submit', onclick: 'button'}
]);

tfl.on('click', function(param) {
	if (param === 'button') {
		tfl.filter('Nouns', function(rowdata) {
			return rowdata.toLowerCase()==='yellow' ? true : false;
		});
		alert(JSON.stringify(tfl.getdata()));
	}
});

tfl.on('context', function(param) {
	alert(JSON.stringify(param));
});

document.body.appendChild(ele);
