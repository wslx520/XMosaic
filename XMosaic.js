/*
类名：XMosaic.js
版本：1.0.0
作者：十年灯@脚儿网 http://jo2.org
说明：仿flash的马赛克遮罩图片切换效果，
*/
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.XMosaic = factory();
  }
}(this, function() {
'use strict';
var slice = Array.prototype.slice;
var _ = {
	id:function (id) {
		//this.id=id;
		return "string" == typeof id ? document.getElementById(id) : id;
	},
	Extend:function(defaults, news) {
		for (var property in news) {
			defaults[property] = news[property];
		}
		return defaults;
	},
	Bind:function(object, fun) {
		var args = slice.call(arguments).slice(2);
		return function() {
			return fun.apply(object, args.concat(slice.call(arguments)));
		}
	},
	Create:function(o,pro){
		var e=document.createElement(o);
		for(var p in pro){
			e.setAttribute(p,pro[p]);
		}
		return e;
	},
	On:(function(){
		return (window.addEventListener) ? function(eType,eFunc,eObj) {
			eObj.addEventListener(eType,eFunc,false);
		} : function(eType,eFunc,eObj) {
			eObj.attachEvent("on"+eType,eFunc);
		};
	})(),
	cutover:function(arr,cur,cls){
		for(var i=0,l=arr.length;i<l;i++){
			if(arr[i].className.indexOf(cls) != -1) {
				arr[i].className = arr[i].className.replace(cls,'');
			}
		}
		arr[cur].className = arr[cur].className.replace(/\s$/g,'') + ' ' + cls;
	},
	setAlpha:(function(){ 		
		return (-[1,]) ? function (obj,alpha) {
				obj.style.opacity = alpha * 0.01;
			} : function(obj,alpha){
				obj.style.filter = "alpha(opacity=" + alpha + ")";
			};
	})(),
	forEach:function(arr,fun){
		for(var i=0,l=arr.length;i<l;i++){
			fun(arr[i],i,arr)
		}
	}
}
var shuffle = function (arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i),x = arr[--i],  arr[i] = arr[j], arr[j] = x);
    return arr;
}
function XMosaic(id,options) {
	return new XMosaic.main(id,options);
}
XMosaic.main = function(id,options) {
    var self = this;
	self.wraper = _.id(id);
	self.items = self.wraper.children;
	self.number = self.items.length;
	
	self.What = ['top','left','height','width'];
	self.fan = 1;
	self.now = self.next = 0;
	
	self.options = self.reset(options);
	
	self.Width = self.options.Width || self.wraper.offsetWidth;
	self.Height = self.options.Height || self.wraper.offsetHeight;
	self.how = self.options.how;
	self.order = self.options.order;
	self.auto = self.options.auto;
	self.event = self.options.event;
	self.initial();
}
XMosaic.prototype = {
	reset:function(options){
		var defaults = {
			countX:5,
			countY:5,
			how:0,
			doing:500, //动画持续时间
			delay:4000,
			order:0,
			event:'mouseover',
			auto:true
		}
		return _.Extend(defaults,options);
	},
	initial:function(){
		var self = this;
        var options = self.options;
		self.images = (function(){
			var images = [];
			for(var i=0,l=self.items.length;i<l;i++) {
				images.push(self.items[i].getElementsByTagName('IMG')[0]);
			}
			return images;
		})();
		//_.Extend(self,options);
		//console.log(self.countY);
		//console.log(options.countY);
		self.count = options.countX*options.countY;
		self.changeNow = options.changeNow ? 1 : 0;
		
		self.delay = options.delay;
		
			//if(self.how) self.what = ['left','top','width','height'][self.how];
			
		self.speed = Math.floor(options.doing / self.count);
		//alert(self.speed);
		self.sWidth = self.Width/options.countX;
		self.sHeight = self.Height/options.countY;
		//console.log(self.sWidth);
		var pos = {x:0,y:0}
		//插入大DIV及所有小DIV	
		self.smalls = [];
		self.wraper.style.position = 'relative';
		for(var i=0;i<self.number;self.items[i++].style.cssText +='position:absolute; top:0;left:0;');
		
		if(self.how > 0){
			self.what = self.What[self.how%2];
			if(self.how > 2){
				self.fan = -1;
				if(self.how > 6) {
					self.what = self.What[self.how%2+2]
					var wh = 1; //是否是变更宽高
					
				}	
			}
		}
		
		//console.log(self.what);		
		
		self.bigDIV = (function(){
			if(!_.id('MosaicInner')) {
				var DIV = _.Create('A',{'class':'MosaicInner','target':'_blank','id':'MosaicInner' });			
				for(var i=0; i < self.count; i++) {
					var s = _.Create('DIV',{'id':'div'+i});
					s.style.cssText = "float:left; position:absolute;background:url() 50% 50% no-repeat; width:"+self.sWidth+"px; height:"+self.sHeight+"px;left:"+pos.x*self.sWidth+"px;top:"+pos.y*self.sHeight+"px; background-position:"+(-pos.x*self.sWidth)+"px "+(-pos.y*self.sHeight)+"px; width:"+self.sWidth+"px; height:"+self.sHeight+"px;";
					_.setAlpha(s,0);
					
					s.e = parseInt(s.style[self.what]);
					//s.w = parseInt(s.style.width);
					s.h = parseInt(s.style.height);
					s.w = parseInt(s.style.width);
					s.b = s.e - (wh ? s.e : 100*self.fan );
					s.c = s.e - s.b;
					if(self.how >4 && self.how < 7){
						if(i % 2) {
							//console.log(i);
							s.b = s.b + s.c;
							s.c = s.b - s.c;
							s.b = s.b - s.c;
						}
					}
					//console.log(self.fan+self.what+s.c);
					pos.x++;
					//console.log(pos.x);
					if(pos.x > self.options.countX-1) {
						pos.x = 0;
						pos.y++;
					}
					self.smalls.push(DIV.appendChild(s));
				}
				
				DIV.style.cssText = "position:absolute; display:block; top:0; left:0; width:"+self.Width+"px;height:"+self.Height+"px;z-index:99;";
				return DIV;	
			}
			
		})();
				
		self.wraper.appendChild(self.bigDIV);
		self.items[0].style.zIndex = 10;
		self.Run = self.run();
		//console.log(self.Run);
		
		self.pager = _.id(options.pager);
		self.pager && self.Pager();
		self.auto && (self.timer = setTimeout(_.Bind(self,self.Next),self.delay)) ;
	},
	go:function(num){
        var self = this;
		clearTimeout(self.timer);
		//clearTimeout(self._timer);
		for(var i=0,l=self.count;i<l;clearTimeout(self.smalls[i++].timer));
		self._time = 0;
		//console.log(self.timer);
		self.curS = self.items[self.now];
		
		//console.log(self.now);
		//for(var i=0;i<self.count;(if(i != self.now) self.items[i++].style.zIndex = 5));
		if(num != undefined) { self.next = num	}
		else { self.next=self.now+1; }
		//(num != undefined ) && (self.next = num) || (self.next = self.now+1);
		(self.next>= self.number ) && (self.next = 0) || (self.next < 0) && (self.next = (self.number-1));
		if(self.next != self.now) {
			for(var i=0,l=self.number;i<l;i++){
				if(i != self.now) {
					self.items[i].style.zIndex = 5;
				}
			}
			self.curS.style.zIndex = 10;
			self.nextS = self.items[self.next];
			//self.nextS.style.zIndex = 5;
			self.going = 0;
			self.bigDIV.style.display = 'block';
			self.Run();
			if(self.pager)  { _.cutover(self.pages,self.next,'on')};
			self.now = self.next;
		}
	},
	run:function(){
		var self = this,
			speed = self.speed,
			count = self.count,
			how = self.how,
			what = self.what,
			smalls = self.smalls,
			order = self.order;
		//if(self.order) {
		if(order == 4) {
			var random = [];
			for(var i=0;i<count;random.push(i++));
			for (var t,num,t1,t2,i=0;i<count;i++){
				t1=count-i;
				t2=t1-1;
				num=Math.floor(Math.random()*t1);
				//去掉下面的输出看实际速度
				//document.write(random[num]);
				t=random[t2];    //A1

				random[t2]=random[num];   //A2
				random[num]=t;   //A3
				//console.log(random[t2]);
			}
			//console.log(random);
			//}
		}
		var changeI = function (){
			var arr= [
				function(i) {
					return i;//从开头到末尾
				},
				function(i) {
					return count-i;//从末尾到开头
				},
				function(i){
					return Math.floor(Math.abs(i-(count-1)/2));//中间到两头
				},
				function(i){
					return i>=(count-1)/2 && (i = (count-1)-i) || i; //两头到中间
				},
				function(i){
					//console.log(i);
					//random.shuffle();
					return random[i]; //随机
				},
				function(i){
					return  0; //同时进行
				}
			];
			//console.log(order);
			return arr[order];
		}();
		return	function(){
				this.nowPic = this.images[this.next];
				var src = this.nowPic.src;
				if(random) shuffle(random); //如果有随机数组，则再次随机
				_.forEach(smalls,
					function(elm,i){
						elm.style.backgroundImage = 'url('+src+')';
						elm.end = 0;
						_.setAlpha(elm,0);
						//console.log(elm.b);
						elm.style[what] = elm.b + 'px';
						// elm.style.backgroundPositionX = -elm.w*i + 'px';
						//console.log(elm.b+elm.c);
						//console.log(i);
						//elm.c = elm.style.top
						//console.log(elm.b +' '+elm.h)
						elm.todo = function(){
							if((elm.end+=5) < 100 ){
								_.setAlpha(elm,elm.end);
								
								// elm.style[what] = Math.floor(QuadOut(elm.end,elm.b,elm.c,100)) + 'px';
								elm.style[what] = Math.floor(elm.b + easeOutStrong(elm.end/100) * elm.c) + 'px';
								//elm.style.backgroundPositionX = Math.floor(-elm.w*i + easeOutStrong(elm.end/100) * -elm.w*i) + 'px';
								if(how ==9) {
									//elm.style.height = Math.floor(QuadOut(elm.end,0,elm.h,100)) + 'px';
									elm.style.height = Math.floor(easeOutStrong(elm.end/100)*elm.h) + 'px';
								}
								
								elm.timer = setTimeout(elm.todo,20);
							} else {
								//console.log('the'+i);
								elm.end = 0;
								elm.style[what] = elm.e+'px';
								how == 9 && (elm.style.height = elm.h + 'px');
								
								_.setAlpha(elm,100);
								self.going++;
								if(self.going == self.count) self.after();
							}
						};
						i = changeI(i);
						
						elm.timer = setTimeout(elm.todo,speed*i);
					}
				);
			}
		
	},
	after:function(){
        var self = this;
		//console.log(self.going +'<>'+ self.count);
		if(self.going != self.count) return;
		self.going = 0;
		self.bigDIV.style.display = 'none';
		self.curS.style.zIndex = 5;
		self.nextS.style.zIndex = 10;
		self.auto && (self.timer = setTimeout(_.Bind(self,self.Next),self.delay)) ;
	},
	Pager:function(){
        var self = this;
        self.pages = _.id(self.pager).children;
        var evt = self.event,
			pl = self.pages.length,
			to;
		//console.log(evt);	
		for(var i = 0; i< pl; i++){
			(function(i){
				_.On(evt,
					function(){
						//console.log(i);
						self.Pause();
						to = setTimeout(function(){self.go(i)},150);
					},
					self.pages[i]);
				_.On('mouseout',
					function(){
						clearTimeout(to);
						if(self.options.auto) self.auto = true;
						//self.Cont();
					},
					self.pages[i]);	
			})(i);
		}
	},
	Prev:function(){
		this.go(--this.next);
	},
	Next:function(){
		this.go(++this.next);
	},
	Pause:function(){
		clearTimeout(this.timer);
		this.auto = false;
		//console.log('Pause!' + this.timer);
	},
	Cont:function(){
		//this.Pause();
		clearTimeout(this.timer);
		this.auto = true;
		this.timer = setTimeout(_.Bind(this,this.Next),this.delay);
		//console.log(this.timer);
	}
}
XMosaic.main.prototype = XMosaic.prototype;
function QuadOut(t,b,c,d){
	return -c *(t/=d)*(t-2) + b;
}
function easeOutStrong(d) {
	return 1 - --d * d * d * d
}
return XMosaic;
}));