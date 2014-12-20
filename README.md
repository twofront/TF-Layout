
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

Many of the parts of this data are optional, and will be assumed when omitted. It is also possible to define templates in javascript. This allows shorter input to be automatically converted to a more complex, standardized format. Example:

	layout.template("input", {"type": "row", "contents": [
		{"type": "column", "contents": [
			{"type": "text", "value": "#name"}
		]},
		{"type": "column", "contents": [
			{"type": "input", "subtype": "#subtype", "value": "#value"}
		]}
	]});
	[
		{"type": "input", "subtype": "text", "name": "Username"},
		{"type": "input", "subtype": "text", "name": "Password"}
	]
