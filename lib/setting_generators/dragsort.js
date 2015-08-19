
var dom = require('tfdom');

function divPosition(ele) {
	var last = [0,0];
	if (ele.parentNode) last = divPosition(ele.parentNode);
	if (ele.offsetLeft) last[0] += ele.offsetLeft;
	if (ele.offsetTop) last[1] += ele.offsetTop;
	return last;
}

module.exports = function(domelement, data) {
	(function (that, domelement, data) {
		var group = that.group;
		var moveListener = null;
		var upListener = null;
		var tbl = null;
		var hldr = null;
		var offset = [0,0];
		var downPos = [0,0];

		var col = that.settings.styleprefix + 'Column' + (data.stylesuffix?data.stylesuffix:'');

		function moveIt(e) {
			tbl.style.left = (e.clientX-offset[0])+'px';
			tbl.style.top = (e.clientY-offset[1])+'px';
			var pos = 999999999999999;
			var ele = null;
			for (var i=0; i<group.rows.length; i++) {
				var r = group.rows[i];
				if (r.element !== domelement) {
					var t = divPosition(r.element);
					if (e.clientY < t[1] && t[1] < pos) {
						pos = t[1];
						ele = r.element;
					}
				}
			}
			if (ele) group.element.insertBefore(hldr, ele);
			else group.element.appendChild(hldr);
		}

		function upIt(e) {
			group.element.insertBefore(domelement, hldr);
			group.element.removeChild(hldr);
			document.body.removeEventListener('mousemove', moveIt);
			document.body.removeEventListener('mouseup', upIt);
		}

		dom.on(domelement, 'mousedown', function(e) {
			downPos = [e.clientX, e.clientY];
			var dPos = divPosition(domelement);
			offset = [e.clientX-dPos[0], e.clientY-dPos[1]];

			hldr = dom.create('tr', {'children': [dom.create('td', {'style': 'height: '+domelement.offsetHeight+'px;'})]});
			group.element.insertBefore(hldr, domelement);

			tbl = dom.create('table', {'class': group.defaultclass, 'style': 'position: absolute; top: 0px; left: 0px; width: '+domelement.offsetWidth+'px; z-index: 2; background: black; opacity: 0.8;'});

			tbl.appendChild(domelement);
			document.body.appendChild(tbl);
			moveIt(e);
			moveListener = document.body.addEventListener('mousemove', moveIt);
			upListener = document.body.addEventListener('mouseup', upIt);
		});
	})(this, domelement, data);
}
