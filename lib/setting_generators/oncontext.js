
var dom = require('tfdom');

module.exports = function(domelement, data) {
	(function(that, data) {
		var row = that.row;
		var menuOptions = data.oncontext!==undefined ? data.oncontext : that.group.oncontext;
		domelement.addEventListener('contextmenu', function(e) {
			if (typeof(menuOptions) === 'object' && Array.isArray(menuOptions)) {
				var collider = dom.create('div', {
					parent: document.body,
					style: 'position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; z-index: 10; background: rgba(0,0,0,0.1)'
				});
				dom.on(collider, 'click', function() {
					document.body.removeChild(collider);
					document.body.removeChild(mainele);
				});
				var mainele = dom.create('div', {
					parent: document.body,
					style: 'position: fixed; top: '+e.clientY+'px; left: '+e.clientX+'px; width: 100px; z-index: 10; overflow: hidden; background: white; border: 1px solid black;',
					class: that.settings.styleprefix + 'Context' + (data.stylesuffix?data.stylesuffix:'')
				});
				for (var i=0; i<menuOptions.length; i++) {
					(function(menuOption) {
						var ele = dom.create('div', {
							innerHTML: menuOption,
							parent: mainele,
							style: 'position: relative; padding: 5px; line-height: 12px; font-size: 12px;' + (i!==0 ? ' border-top: 1px solid black' : '')
						});
						dom.on(ele, 'click', function() {
							document.body.removeChild(collider);
							document.body.removeChild(mainele);
							that.emit('context', {
								'row': row ? row.value : null,
								'column': data.id,
								'value': data.value,
								'data': menuOption
							});
						});
					})(menuOptions[i]);
				}
			} else {
				that.emit('context', {
					'row': row.value,
					'column': data.id,
					'value': data.value,
					'data': menuOptions
				});
			}
			e.preventDefault();
		});
	})(this, data);
}
