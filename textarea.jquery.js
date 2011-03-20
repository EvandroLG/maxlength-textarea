/*
	Plugn that simulates maxlength for textarea
	Features:
	- Validation on load
	- Validation on paste
	- Validation on keypress
	- Count of characters visible
	- Allows CTRL + (...)
	- Only run kepress and paste functionality in case the browser does not support the maxlength to textarea (HTML 5)
	@param Object
	@return undefined
	@author Evandro L. Gonçalves
*/
(function($){
	$.fn.textarea = function(options){
		var settings = {maxlength: 10, visibleCount: true};
		options = $.extend(settings, options);
		
		var init = function(current){
			var 
				valueSizeInit = current.attr("value").length,
				maxValue = parseInt(current.attr("maxlength"), 10) > 0 ? current.attr("maxlength") : options.maxlength;
			
			if(options.visibleCount){
				current.after("<div class='maxValue'>" + (maxValue - valueSizeInit) + "</div>");
			}
			
			if(!browserSupport(current)){
				current.keypress(function(e){
					var 
						code = e.charCode ? e.charCode : e.keyCode,
						keyReserved = (code == 8 || code == 64 || code == 9 || code == 37 || code == 38 || code == 39 || code == 40 || code == 46),
						
					self = $(this),
					value = self.attr("value"),
					valueSize = value.length,
					countCurrent = self.next();
					
					if(valueSize >= maxValue){
						return keyReserved || (!e.metaKey ? e.ctrlKey : e.metaKey);
					}	
				}).bind("paste", function(){
					var self = $(this);
					
					setTimeout(function(){
						var 
							value = self.attr("value");
							valueSize = value.length;
						
						if(valueSize > maxValue){
							self.attr("value", value.substr(0, maxValue));
						}	
					}, 10);
				});
			}
			
			if(options.visibleCount){
				current.keyup(function(e){
					var 
						self = $(this),
						value = self.attr("value"),
						valueSize = value.length,
						countCurrent = self.next();
					
					countCurrent.html((maxValue - valueSize));
				});	
			}
		};
		
		browserSupport = function(elem){
			var i = document.createElement('textarea');
  			return ("maxLength" in i) && (elem.attr("maxlength") > 0);
		};
		
		this.each(function(){
			init($(this));
		});
	};
	
	$("textarea[maxlength]").each(function(){
		$(this).textarea();	
	});
})(jQuery);