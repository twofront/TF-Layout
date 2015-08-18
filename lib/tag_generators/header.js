
var dom = require('tfdom');

function resetHeader() {
	this.activeheader.holder.appendChild(this.activeheader.header);
	this.activeheader.holder.style.height = null;
	this.activeheader = null;
}

function scrolled(e) {
	this.headerholder.style.left = -e.target.scrollLeft+'px';
	var topPos = e.target.scrollTop;
	for (var i=this.headerstack.length-1; i>=0; i--) {
		var h = this.headerstack[i];
		if (h.holder.offsetTop < topPos) {
			h.holder.style.height = h.holder.offsetHeight+'px';
			this.headerholder.appendChild(h.header);
			if (this.activeheader && this.activeheader !== h) resetHeader.call(this);
			this.activeheader = h;
			return;
		}
	}
	if (this.activeheader) resetHeader.call(this);
}

module.exports = function(e) {
	var that = this;
	var tag_generators = require('./');
	if (!this.headerstack) {
		this.headerstack = [];
		this.container.addEventListener('scroll', function(e) {
			scrolled.call(that, e);
		});
	}
	
	// This is necessary since it will hold the headers vertical space in the list if it has to move
	// to the fixed position header div.
	var headerholder = dom.create('div', {
		style: 'position: relative; z-index: 1;'
	});

	var group = dom.create('table', {
		parent: headerholder,
		class: this.settings.styleprefix + 'Header' + (e.stylesuffix?e.stylesuffix:'')
	});

	this.headerstack.push({
		holder: headerholder,
		header: group
	});

	this.container.appendChild(headerholder);
	return {'element': group, 'rows': []};
}
