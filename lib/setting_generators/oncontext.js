
var dom = require('tfdom');

function callEvents(evs, val) {
	if (evs) {
		for (var i=0; i<evs.length; i++) {
			evs[i](val);
		}
	}
}

module.exports = function(domelement, data) {
	(function(that, data) {
		var menuOptions = data.oncontext;
		data.oncontext = null;
		domelement.addEventListener('contextmenu', function(e) {
			if (typeof(menuOptions) === 'object' && Array.isArray(menuOptions)) {
				var collider = dom.create('div', {
					parent: that.container,
					style: 'position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; z-index: 10; background: rgba(0,0,0,0.1)'
				});
				dom.on(collider, 'click', function() {
					that.container.removeChild(collider);
					that.container.removeChild(mainele);
				});
				var mainele = dom.create('div', {
					parent: that.container,
					style: 'position: absolute; top: '+e.clientY+'px; left: '+e.clientX+'px; width: 100px; z-index: 10; overflow: hidden; background: white; border: 1px solid black;'
				});
				for (var i=0; i<menuOptions.length; i++) {
					(function(menuOption) {
						var ele = dom.create('div', {
							innerHTML: menuOption,
							parent: mainele,
							style: 'position: relative; padding: 5px; line-height: 12px; font-size: 12px;' + (i!==0 ? ' border-top: 1px solid black' : '')
						});
						dom.on(ele, 'click', function() {
							that.container.removeChild(collider);
							that.container.removeChild(mainele);
							callEvents(that.events['context'], menuOption);
						});
					})(menuOptions[i]);
				}
			} else {
				callEvents(that.events['context'], menuOptions);
			}
			e.preventDefault();
		});
	})(this, data);
}
