/**
* jQuery Cycle Item
* Copyright (c) 2011 Kevin Doyle
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
**/

(function($){
	var config = {
		delay: 10000,
		timeoutDelay: 5000,
		section: ".cycleitem",
		initialIndex: 0,
		navigation: false,
		limit: null,
		onCycle: function(){}
	};
	var el, current, next, isForced, isPaused, isAfterForced, cycle, timeout, timeoutStatus, obj, index, isEnabled;
	var methods = {
		init : function(settings) {
			if (settings) { $.extend(config, settings) };
			return this.each(function(){
				el = $(this);
				if(!config.limit){
					config.limit = el.find(config.section).length;
				}
				isPaused = false;
				isForced = false;
				isEnabled = true;
				current = -1;
				next = 0;
				if(config.limit > 1){
					methods._createTimer();
				}
				if(config.navigation){
					$(config.navigation).bind("click", methods._forceCycle);
				}				
			});
		},
		cycle : function(){
			if(config.navigation){
				$(config.navigation+".current").removeClass("current");
				$(config.navigation).eq(next).addClass("current");	
			}
			config.onCycle.call(el,{current:current, next:next});
			if(isForced) {
				isForced = false;
				isAfterForced = true;
			}
		},
		resetCycle : function(){
			current = config.initialIndex - 1;
			next = 0;
		},
		disableNavigation : function(){
			isEnabled = false;
		},
		enableNavigation : function(){
			isEnabled = true;
		},		
		_controlCurrent : function(dir){
			if(isAfterForced){
				current = next;
				next = current + 1;
				if(current === config.limit-1){
					next = 0;
				}
				isAfterForced = false;
			} else if (current === config.limit-1 && dir === "up") {
				current = 0;
				next = 1;
			} else {
				current += 1;
				if(dir === "up" && current === 0){
					next = 1;
				} else if(dir === "up" && current === config.limit-1){
					next = 0;	
				} else if(dir === "up" && current > 0 && current < config.limit-1){
					next = current+1;
				}
			}
		},
		_createTimer : function(){
			rotate = setInterval(methods._autoCycle,config.delay);	
			if(isForced) {
				isForced = false;
				isAfterForced = true;
			}
		},			
		_autoCycle : function(){
			methods._controlCurrent("up");
			methods.cycle();
		},
		_forceCycle : function(event){
			if(!isForced && isEnabled){
				methods._delayTimer();
				obj = $(event.currentTarget);
				index = $(config.navigation).index(obj);
				if(next !== index){
					isForced = true;
					current = next;
					next = index;
					methods.cycle();
				}
			}
			return false;
		},
		_stopTimer : function(){
			if(typeof(rotate) !== 'undefined'){
				clearInterval(rotate);
			}
			if(typeof(timeout) !== 'undefined'){
				clearTimeout(timeout);
			}
		},
		_delayTimer : function(){
			methods._stopTimer();
			if(!isPaused){
				timeout = setTimeout(methods._createTimer, config.timeoutDelay);
			}
		}
	};
	
	$.fn.cycleItem = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on cycleItem');
		}    
	};
})(jQuery);