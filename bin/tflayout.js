!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module){module.exports={get:function(id){if(1===arguments.length)return document.getElementById(id);for(var eles={},i=0;i<arguments.length;i++)eles[arguments[i]]=document.getElementById(arguments[i]);return eles},create:function(tag,info){var tg=document.createElement(tag);return info&&this.update(tg,info),tg},update:function(tg,info){for(var e in info)"innerHTML"!==e&&"innerText"!==e&&"children"!==e&&"parent"!==e&&tg.setAttribute(e,info[e]);if(info.innerHTML&&(tg.innerHTML=info.innerHTML),info.innerText&&tg.appendChild(document.createTextNode(info.innerText)),info.children)for(var i=0;i<info.children.length;i++)tg.appendChild(info.children[i]);return info.parent&&info.parent.appendChild(tg),this},on:function(a,b,c,d){return function(ele,event,action,downtree){return downtree||(downtree=!1),"click"===event&&"ontouchstart"in document.documentElement&&(event="touchend"),ele.addEventListener(event,action,downtree),{remove:function(){ele.removeEventListener(event,action,downtree)}}}(a,b,c,d),this}}},{}],2:[function(require){window.TFLayout=require("./")},{"./":3}],3:[function(require,module,exports){function generateChildren(data){for(var i=0;i<data.length;i++){var e=data[i];if(this.templates[e.type]){var t=this.templates[e.type];for(var f in e)"type"!==f&&(t=t.replace(new RegExp("#"+f,"g"),e[f]));t=t.replace(/\#([a-zA-Z_]+)/g,""),t=JSON.parse(t),t=[i,1].concat(t),Array.prototype.splice.apply(data,t),e=data[i]}tag_generators[e.type]?(this[e.type]=tag_generators[e.type].call(this,e),e.contents&&generateChildren.call(this,e.contents),this[e.type]=null):console.log('TFLayout: Unknown type "'+e.type+'"')}}var dom=require("tfdom"),tag_generators=require("./lib/tag_generators");module.exports=exports=function(settings){this.settings=settings?settings:{},void 0===this.settings.styleprefix&&(this.settings.styleprefix=""),this.events={},this.templates={},this.formdata={},this.elements={},this.displaygroups={}},exports.prototype.build=function(data){return this.container=dom.create("div",{"class":this.settings.styleprefix+"Container"}),this.headerholder=dom.create("div",{style:"position: absolute; top: 0px; left: 0px; overflow: hidden;"}),this.headerstack=null,this.formdata={},this.elements={},this.displaygroups={},generateChildren.call(this,data),this.settings.parent?(this.settings.parent.appendChild(this.container),this.settings.parent.appendChild(this.headerholder),this.settings.parent.ontouchmove=function(e){e.stopPropagation()},void 0):this.container},exports.prototype.filter=function(){},exports.prototype.getdata=function(){var d={};console.log(this.formdata);for(var e in this.formdata)if(d[e]=this.formdata[e].value,"object"==typeof d[e]&&null!==d[e]&&d[e].value&&(d[e]=d[e].value),Array.isArray(d[e])){for(var na=[],i=0;i<d[e].length;i++)na.push(d[e][i].value);d[e]=na}return d},exports.prototype.on=function(ev,callback){this.events[ev]||(this.events[ev]=[]),this.events[ev].push(callback)},exports.prototype.emit=function(ev,e){if(this.events[ev])for(var evs=this.events[ev],i=0;i<evs.length;i++)evs[i](e)},exports.prototype.template=function(name,value){Array.isArray(value)||(value=[value]),this.templates[name]=JSON.stringify(value)}},{"./lib/tag_generators":18,tfdom:1}],4:[function(require,module){module.exports=function(){}},{}],5:[function(require,module){var row=require("./row"),group=require("./group");module.exports=function(domelement,data,tagtype){"row"===tagtype&&row.call(this,domelement,data),"group"===tagtype&&group.call(this,domelement,data)}},{"./group":4,"./row":6}],6:[function(require,module){function divPosition(ele){var last=[0,0];return ele.parentNode&&(last=divPosition(ele.parentNode)),ele.offsetLeft&&(last[0]+=ele.offsetLeft),ele.offsetTop&&(last[1]+=ele.offsetTop),ele.scrollLeft&&(last[0]-=ele.scrollLeft),ele.scrollTop&&(last[1]-=ele.scrollTop),last}function removeElement(elements,data){for(var i=0;i<elements.length;i++){var r=elements[i];if(r===data)return elements.splice(i,1),!0;if(r.children&&removeElement(r.children,data))return!0}return!1}function moveElement(elements,parentElement,childData){removeElement(elements,childData);for(var i=0;i<elements.length;i++){var r=elements[i];if(r.element===parentElement)return elements.splice(i,0,childData),!0}return!1}function updateGroupValue(group){group.value=group.rows}var dom=require("tfdom");module.exports=function(domelement,data){!function(that,domelement,data){function downIt(e){hldr=dom.create("tr",{children:[dom.create("td",{style:"height: "+domelement.offsetHeight+"px;"})]}),group.element.insertBefore(hldr,domelement),tbl=dom.create("table",{"class":group.defaultclass,style:"position: absolute; top: 0px; left: 0px; width: "+domelement.offsetWidth+"px; z-index: 2; background: black; opacity: 0.8;"}),tbl.appendChild(domelement),document.body.appendChild(tbl),moveIt(e)}function moveIt(e){if(null===tbl)Math.abs(e.clientY-downPos[1])>10&&downIt(e);else{tbl.style.left=e.clientX-offset[0]+"px",tbl.style.top=e.clientY-offset[1]+"px";var pos=999999999999999;ele&&(ele.style.background=null),ele=null,makeChild=!1;for(var i=0;i<group.rows.length;i++){var r=group.rows[i];if(r.element!==domelement){var t=divPosition(r.element),childMin=t[1]+r.element.offsetHeight/4,childMax=t[1]+3*r.element.offsetHeight/4;if(t[1]+=r.element.offsetHeight/2,group.childrows&&e.clientY>childMin&&e.clientY<childMax){makeChild=!0,ele=r.element;break}e.clientY<t[1]&&t[1]<pos&&(pos=t[1],ele=r.element)}}makeChild?ele.style.background="rgb(192,192,192)":ele?group.element.insertBefore(hldr,ele):group.element.appendChild(hldr)}}function upIt(){tbl&&(makeChild?(group.element.insertBefore(domelement,ele.nextSibling),moveElement(group.rows,ele,data),data.columns[0].element.style.paddingLeft="20px"):(group.element.insertBefore(domelement,hldr),moveElement(group.rows,ele,data)),updateGroupValue(group),ele&&(ele.style.background=null),group.element.removeChild(hldr),document.body.removeChild(tbl),tbl=null,that.emit("sort",{})),document.body.removeEventListener("mousemove",moveIt),document.body.removeEventListener("mouseup",upIt)}{var group=that.group,moveListener=(that.row,null),upListener=null,tbl=null,hldr=null,ele=null,makeChild=!1,offset=[0,0],downPos=[0,0];that.settings.styleprefix+"Column"+(data.stylesuffix?data.stylesuffix:"")}dom.on(domelement,"mousedown",function(e){downPos=[e.clientX,e.clientY];var dPos=divPosition(domelement);offset=[e.clientX-dPos[0],e.clientY-dPos[1]],moveListener=document.body.addEventListener("mousemove",moveIt),upListener=document.body.addEventListener("mouseup",upIt)})}(this,domelement,data)}},{tfdom:1}],7:[function(require,module){var generators={onchange:{implementation:require("./onchange"),tags:["input"]},onclick:{implementation:require("./onclick"),tags:["column","row","group","input"]},oncontext:{implementation:require("./oncontext"),tags:["column"]},search:{implementation:require("./search"),tags:["input"]},sort:{implementation:require("./sort"),tags:["column"]},dragsort:{implementation:require("./dragsort"),tags:["group","row"]},select:{implementation:require("./select"),tags:["row"]},multiselect:{implementation:require("./multiselect"),tags:["row"]}};module.exports=function(tagType,ele,data){for(var e in generators)(void 0!==data[e]||this.group&&this.group[e])&&-1!==generators[e].tags.indexOf(tagType)&&generators[e].implementation.call(this,ele,data,tagType)}},{"./dragsort":5,"./multiselect":8,"./onchange":9,"./onclick":10,"./oncontext":11,"./search":12,"./select":13,"./sort":14}],8:[function(require,module){var dom=require("tfdom");module.exports=function(domelement,data){this.group;data.value={name:data.value,value:!1},dom.on(domelement,"click",function(){data.value.value?(domelement.setAttribute("class",data.defaultclass),data.value.value=!1):(domelement.setAttribute("class",data.defaultclass+" Selected"),data.value.value=!0)})}},{tfdom:1}],9:[function(require,module){module.exports=function(domelement,e){!function(that,domelement,data){var name=data.name;domelement.addEventListener("change",function(){that.emit("change",{name:name,value:domelement.value})})}(this,domelement,e)}},{}],10:[function(require,module){module.exports=function(domelement,e){!function(that,data){var row=that.row,callbackParam=data.onclick;data.onclick=null,domelement.addEventListener("click",function(){that.emit("click",{row:row?row.value:null,column:data.id,value:data.value,data:callbackParam})})}(this,e)}},{}],11:[function(require,module){var dom=require("tfdom");module.exports=function(domelement,data){!function(that,data){var row=that.row,menuOptions=void 0!==data.oncontext?data.oncontext:that.group.oncontext;domelement.addEventListener("contextmenu",function(e){if("object"==typeof menuOptions&&Array.isArray(menuOptions)){var collider=dom.create("div",{parent:document.body,style:"position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; z-index: 10; background: rgba(0,0,0,0.1)"});dom.on(collider,"click",function(){document.body.removeChild(collider),document.body.removeChild(mainele)});for(var mainele=dom.create("div",{parent:document.body,style:"position: fixed; top: "+e.clientY+"px; left: "+e.clientX+"px; width: 100px; z-index: 10; overflow: hidden; background: white; border: 1px solid black;","class":that.settings.styleprefix+"Context"+(data.stylesuffix?data.stylesuffix:"")}),i=0;i<menuOptions.length;i++)!function(menuOption){var ele=dom.create("div",{innerHTML:menuOption,parent:mainele,style:"position: relative; padding: 5px; line-height: 12px; font-size: 12px;"+(0!==i?" border-top: 1px solid black":"")});dom.on(ele,"click",function(){document.body.removeChild(collider),document.body.removeChild(mainele),that.emit("context",{row:row?row.value:null,column:data.id,value:data.value,data:menuOption})})}(menuOptions[i])}else that.emit("context",{row:row.value,column:data.id,value:data.value,data:menuOptions});e.preventDefault()})}(this,data)}},{tfdom:1}],12:[function(require,module){var dom=require("tfdom");module.exports=function(domelement,data){"string"==typeof data.search&&(data.search=[data.search]),domelement.getAttribute("placeholder")||domelement.setAttribute("placeholder","Search"),function(that,data){dom.on(domelement,"keyup",function(){for(var j=0;j<data.search.length;j++)for(var searchgroup=that.elements[data.search[j]].element,i=0;i<searchgroup.childNodes.length;i++){var n=searchgroup.childNodes[i];n.style.display=-1!==n.innerHTML.toLowerCase().indexOf(domelement.value.toLowerCase())?"table-row":"none"}})}(this,data)}},{tfdom:1}],13:[function(require,module){var dom=require("tfdom");module.exports=function(domelement,data){var group=this.group;data.value={name:data.value,value:!1},dom.on(domelement,"click",function(){group.currentselection&&group.currentselection(),domelement.setAttribute("class",data.defaultclass+" Selected"),data.value.value=!0,group.currentselection=function(){domelement.setAttribute("class",data.defaultclass),data.value.value=!1}})}},{tfdom:1}],14:[function(require,module){var dom=require("tfdom");module.exports=function(domelement,data){"string"==typeof data.sort&&(data.sort=[data.sort]);var sortelement=dom.create("div",{innerHTML:"Sort",style:"position: relative; padding: 3px; float: right; font-size: 10px; height: 100%;"});!function(that,sortelement,data){var direction=1;dom.on(sortelement,"click",function(){sortelement.innerHTML=1===direction?"Sort v":"Sort ^";for(var i=0;i<data.sort.length;i++){var g=that.elements[data.sort[i]];if(g){g.rows.sort(function(a,b){return a.element.innerHTML>b.element.innerHTML?direction:-direction});for(var j=0;j<g.rows.length;j++)g.element.removeChild(g.rows[j].element),g.element.appendChild(g.rows[j].element)}}direction=-direction})}(this,sortelement,data),domelement.appendChild(sortelement)}},{tfdom:1}],15:[function(require,module){var dom=require("tfdom"),setting_generators=require("../setting_generators");module.exports=function(e){var tag_generators=require("./");e.defaultclass=this.settings.styleprefix+"Column"+(e.stylesuffix?e.stylesuffix:"");var column=dom.create("td",{innerHTML:e.html?e.html:"","class":e.defaultclass,colspan:e.colspan?e.colspan:1}),obj={element:column},row=this.row;return row||(row=tag_generators.row.call(this,e)),this.group&&this.group.columnids&&this.group.columnids.length>row.columns.length&&(obj.id=e.id=this.group.columnids[row.columns.length]),row.sort&&(e.sort=row.sort),setting_generators.call(this,"column",column,e),row.element.appendChild(column),row.columns.push(obj),obj}},{"../setting_generators":7,"./":18,tfdom:1}],16:[function(require,module){var dom=require("tfdom"),setting_generators=require("../setting_generators");module.exports=function(e){require("./");e.defaultclass=this.settings.styleprefix+"Table"+(e.stylesuffix?e.stylesuffix:"");var group=dom.create("table",{"class":e.defaultclass});setting_generators.call(this,"group",group,e),this.container.appendChild(group);var rows=[],obj={element:group,rows:rows,value:rows,defaultclass:e.defaultclass,columnids:e.columnids,childrows:e.childrows,select:e.select,multiselect:e.multiselect,dragsort:e.dragsort,oncontext:e.oncontext,onclick:e.onclick};return e.id&&(this.elements[e.id]=obj),e.name&&(this.formdata[e.name]=obj),obj}},{"../setting_generators":7,"./":18,tfdom:1}],17:[function(require,module){function resetHeader(){this.activeheader.holder.appendChild(this.activeheader.header),this.activeheader.holder.style.height=null,this.activeheader=null}function scrolled(e){this.headerholder.style.left=-e.target.scrollLeft+"px";for(var topPos=e.target.scrollTop,i=this.headerstack.length-1;i>=0;i--){var h=this.headerstack[i];if(h.holder.offsetTop<topPos)return h.holder.style.height=h.holder.offsetHeight+"px",this.headerholder.appendChild(h.header),this.activeheader&&this.activeheader!==h&&resetHeader.call(this),void(this.activeheader=h)}this.activeheader&&resetHeader.call(this)}var dom=require("tfdom");module.exports=function(e){{var that=this;require("./")}this.headerstack||(this.headerstack=[],this.container.addEventListener("scroll",function(e){scrolled.call(that,e)}));var headerholder=dom.create("div",{style:"position: relative; z-index: 1;"}),group=dom.create("table",{parent:headerholder,"class":this.settings.styleprefix+"Header"+(e.stylesuffix?e.stylesuffix:"")});return this.headerstack.push({holder:headerholder,header:group}),this.container.appendChild(headerholder),{element:group,rows:[]}}},{"./":18,tfdom:1}],18:[function(require,module){module.exports={group:require("./group"),header:require("./header"),row:require("./row"),column:require("./column"),input:require("./input"),text:require("./text")}},{"./column":15,"./group":16,"./header":17,"./input":19,"./row":20,"./text":21}],19:[function(require,module){var dom=require("tfdom"),setting_generators=require("../setting_generators");module.exports=function(e){var inp,tag_generators=require("./");if("dropdown"===e.subtype){if(inp=dom.create("select",{"class":this.settings.styleprefix+"Input"+(e.stylesuffix?e.stylesuffix:"")}),e.options)for(var i=0;i<e.options.length;i++){var o=dom.create("option",{innerHTML:e.options[i]});inp.appendChild(o)}}else inp=dom.create("input",{type:e.subtype?e.subtype:"text",value:void 0!==e.value?e.value:"",placeholder:e.placeholder?e.placeholder:"","class":this.settings.styleprefix+"Input"+(e.stylesuffix?e.stylesuffix:"")});setting_generators.call(this,"input",inp,e),e.name&&(this.formdata[e.name]=inp,e.name=null);var column=this.column;return column||(column=tag_generators.column.call(this,e)),column.element.appendChild(inp),{element:inp}}},{"../setting_generators":7,"./":18,tfdom:1}],20:[function(require,module){var dom=require("tfdom"),tag_generators=null,setting_generators=require("../setting_generators");module.exports=function(e){tag_generators||(tag_generators=require("./")),e.defaultclass=this.settings.styleprefix+"Row"+(e.stylesuffix?e.stylesuffix:"");var row=dom.create("tr",{"class":e.defaultclass}),table=this.group?this.group:this.header;table||(table=tag_generators.group.call(this,e));var obj={element:row,columns:[],defaultclass:e.defaultclass,sort:e.sort,dragsort:table.dragsort,value:e.value};return setting_generators.call(this,"row",row,obj),table.element.appendChild(row),table.rows.push(obj),obj}},{"../setting_generators":7,"./":18,tfdom:1}],21:[function(require,module){var dom=require("tfdom");module.exports=function(e){var tag_generators=require("./"),tcolumn=this.column,column=tcolumn;column||(column=tag_generators.column.call(this,e));var txt=document.createTextNode(e.value);if(column.element.appendChild(txt),e.editable){tcolumn||(this.column=column);var inp=createInput.call(this,e);inp.style.display="none",this.column=tcolumn,dom.on(this.column.element,"click",function(){inp.style.display="inline-block"})}return{element:txt}}},{"./":18,tfdom:1}]},{},[2]);