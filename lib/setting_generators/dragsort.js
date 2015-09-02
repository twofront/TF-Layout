
var dom = require('tfdom');

function divPosition(ele) {
	var last = [0,0];
	if (ele.parentNode) last = divPosition(ele.parentNode);
	if (ele.offsetLeft) last[0] += ele.offsetLeft;
	if (ele.offsetTop) last[1] += ele.offsetTop;
	if (ele.scrollLeft) last[0] -= ele.scrollLeft;
	if (ele.scrollTop) last[1] -= ele.scrollTop;
	return last;
}

function removeElement(elements, data) {
	for (var i=0; i<elements.length; i++) {
		var r = elements[i];
		if (r === data) {
			elements.splice(i,1);
			return true;
		} else if (r.children) {
			if (removeElement(r.children, data)) return true;
		}
	}
	return false;
}

function moveElement(elements, parentElement, childData) {
	removeElement(elements, childData);
	for (var i=0; i<elements.length; i++) {
		var r = elements[i];
		if (r.element === parentElement) {
			if (!r.children) r.children = [];
			r.children.push(childData);
			return true;
		} else if (r.children) {
			if (moveElement(r.children, parentElement, childData)) return true;
		}
	}
	return false;
}

module.exports = function(domelement, data) {
	(function (that, domelement, data) {
		var group = that.group;
		var row = that.row;
		var moveListener = null;
		var upListener = null;
		var tbl = null;
		var hldr = null;
		var ele = null;
		var makeChild = false;
		var offset = [0,0];
		var downPos = [0,0];

		var col = that.settings.styleprefix + 'Column' + (data.stylesuffix?data.stylesuffix:'');

		function downIt(e) {
			hldr = dom.create('tr', {'children': [dom.create('td', {'style': 'height: '+domelement.offsetHeight+'px;'})]});
			group.element.insertBefore(hldr, domelement);

			tbl = dom.create('table', {'class': group.defaultclass, 'style': 'position: absolute; top: 0px; left: 0px; width: '+domelement.offsetWidth+'px; z-index: 2; background: black; opacity: 0.8;'});

			tbl.appendChild(domelement);
			document.body.appendChild(tbl);
			moveIt(e);
		}

		function moveIt(e) {
			if (tbl === null) {
				if (Math.abs(e.clientY-downPos[1]) > 10) downIt(e);
			} else {
				tbl.style.left = (e.clientX-offset[0])+'px';
				tbl.style.top = (e.clientY-offset[1])+'px';
				var pos = 999999999999999;
				if (ele) ele.style.background = null;
				ele = null;
				makeChild = false;
				for (var i=0; i<group.rows.length; i++) {
					var r = group.rows[i];
					if (r.element !== domelement) {
						var t = divPosition(r.element);
						// Child item...
						var childMin = t[1]+(r.element.offsetHeight/4);
						var childMax = t[1]+(3*r.element.offsetHeight/4);
						t[1] += (r.element.offsetHeight/2);
						if (group.childrows && e.clientY > childMin && e.clientY < childMax) {
							makeChild = true;
							ele = r.element;
							break;
						} else if (e.clientY < t[1] && t[1] < pos) {
							pos = t[1];
							ele = r.element;
						}
					}
				}
				if (makeChild) ele.style.background = 'rgb(192,192,192)';
				else if (ele) group.element.insertBefore(hldr, ele);
				else group.element.appendChild(hldr);
			}
		}

		function upIt(e) {
			if (tbl) {
				if (makeChild) {
					group.element.insertBefore(domelement, ele.nextSibling);
					moveElement(group.rows, ele, data);
					console.log(group.rows);
					data.columns[0].element.style.paddingLeft = '20px';
				} else {
					group.element.insertBefore(domelement, hldr);
				}
				if (ele) ele.style.background = null;
				group.element.removeChild(hldr);
				document.body.removeChild(tbl);
				tbl = null;
				that.emit('sort', {
					
				});
			}
			document.body.removeEventListener('mousemove', moveIt);
			document.body.removeEventListener('mouseup', upIt);
		}

		dom.on(domelement, 'mousedown', function(e) {
			downPos = [e.clientX, e.clientY];
			var dPos = divPosition(domelement);
			offset = [e.clientX-dPos[0], e.clientY-dPos[1]];
			moveListener = document.body.addEventListener('mousemove', moveIt);
			upListener = document.body.addEventListener('mouseup', upIt);
		});
	})(this, domelement, data);
}
