# TF Layout

## Setup

TF Layout is designed to work with (browserify)[http://browserify.org] or by being included directly in the page. When using browserify you create an instance like this:

	var TFLayout = require('');
	var layout = new TFLayout({
		parent: document.getElementById('someParent'),
		styleprefix: 'TFL-'
	});

To include it directly in you page grab the `bin/tflayout.js` file and place it alongside the rest of your project. Then:

	<script src="tflayout.js"></script>
	<script>
		var layout = new TFLayout({
			parent: document.getElementById('someParent'),
			styleprefix: 'TFL-'
		});
	</script>

Note that in both cases you will also need to include appropriate css in your page. See the examples for starting points, then customize it to fit your preferred look.

## Usage

This is some data with complete structure:

	[
		{"type": "group", "contents": [
			{"type": "row", "contents": [
				{"type": "column", "contents": [
					{"type": "text", "value": "Username"}
				]},
				{"type": "column", "contents": [
					{"type": "input", "subtype": "text"}
				]}
			]},
			{"type": "row", "contents": [
				{"type": "column", "contents": [
					{"type": "text", "value": "Password"}
				]},
				{"type": "column", "contents": [
					{"type": "input", "subtype": "password"}
				]}
			]}
		]}
	]

Many of the parts of this data is optional, and will be assumed when omitted. It is also possible to define templates in javascript. This allows shorter input to be automatically converted to a more complex, standardized format. Example:

	layout.template("input", {"type": "row", "contents": [
		{"type": "column", "contents": [
			{"type": "text", "value": "#name"}
		]},
		{"type": "column", "contents": [
			{"type": "input", "subtype": "#subtype", "value": "#value"}
		]}
	]});
	layout.build([
		{"type": "input", "subtype": "text", "name": "Username"},
		{"type": "input", "subtype": "text", "name": "Password"}
	]);
