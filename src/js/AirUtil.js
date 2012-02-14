

/**
 * @module AirUtil.js
 * @description Utilities for common problems and other junk in AIR
 */

function $A(iterable) {
	if (!iterable) return [];
	if (iterable.toArray) return iterable.toArray();
	var length = iterable.length || 0, results = new Array(length);
	while (length--) results[length] = iterable[length];
	return results;	
}

/**
 * @class AirUtil
 */

var AirUtil = function(){

	return {

/**
 * @method		openLink
 * @description	Open a link in the default system browser
 * Example: 
 *  <a href="http://www.adobe.com" onclick="return openLink(this)">Adobe.com</a>
 */ 
 
		openLink: function(link) {
			console.log(link);
			var u = new air.HTMLLoader();
			var r = new air.URLRequest(link.href);
			u.navigateInSystemBrowser = true;
			u.load(r);
			return false;
		}
	
	}

}();

/**
 * @class AirUtil.Console
 * @description Merely a helper class for console interactions. If the
 *  Introspector is available, it is just an alias to air.Introspector.console.
 *  Otherwise, the console functions are adapted to air.trace. In a nutshell 
 *  it's made to mimic firebug.
 *  Also creates the alias window.console if it doesn't already exist.
 */

AirUtil.Console = air && air.Introspector ? air.Introspector.Console : (function() {
	var f = air ? air.trace : function(){};
	
	return { 
		log: f,
		warn: f,
		info: f,
		error: f,
		dump: f	
	};
	
})();

if(!window.console) window.console = AirUtil.Console

/**
 * @class		AirUtil.Xhr
 * @description Helps manage AIR-created XHR requests
*/ 

AirUtil.Xhr = function() {
	
	return {
		prep: function(dispatcher) {
			dispatcher.addEventListener(air.SecurityErrorEvent.SECURITY_ERROR, VU.xhr.listeners.securityError);
			dispatcher.addEventListener(air.IOErrorEvent.IO_ERROR, VU.xhr.listeners.ioError);
			//dispatcher.addEventListener(air.HTTPStatusEvent.HTTP_STATUS, VU.xhr.listeners.httpStatus);
		},
		
		unprep: function(dispatcher) {
			dispatcher.removeEventListener(air.SecurityErrorEvent.SECURITY_ERROR, VU.xhr.listeners.securityError);
			dispatcher.removeEventListener(air.IOErrorEvent.IO_ERROR, VU.xhr.listeners.ioError);
			//dispatcher.removeEventListener(air.HTTPStatusEvent.HTTP_STATUS, VU.xhr.listeners.httpStatus);
		},
		
		listeners : {
			securityError: function(event) {
				console.error("securityErrorHandler", event);
			},
			
			httpStatus: function(event) {
				console.info("httpStatusHandler", event);
			},
			
			ioError: function(event) {
				console.log("ioErrorHandler", event);
			}
		}
	}
	
}(),

/**
 * @class		AirUtil.Event
 * @description Easier management for AIR events. The main purpose is to 
 *  centralize the event process by controlling all of its aspects through a 
 *  single object
 * @constructor
 * @param config {object}
 */ 

AirUtil.Event = function(config) {
	this.config = this.defaults;
	
	if(!Function.prototype.bindAsEventListener) {
		Function.prototype.bindAsEventListener = function() {
			var __method = this, args = $A(arguments), object = args.shift();
			return function(event) {
				return __method.apply(object, [event || window.event].concat(args));
			}
		};
	}
	
	this.onFire = this.onFire.bindAsEventListener(this);
	
	for (var property in config)
		this.config[property] = config[property];
		
	this.resume();
}

AirUtil.Event.prototype = {

	defaults: {
		element: null,
		event: null,
		handler: null,
		useCapture: false,
		priority: 0,
		useWeakReference: false,
		scope: window,
		single: false
	},

/**
 * @method 		stop
 * @description Removes the event listener
 * @return 		{void}
 */
	
	stop: function() {
		this.stopped = true;
		this.config.element.removeEventListener(this.onFire, this.config.handler, this.config.useCapture);		
	},

/**
 * @method 		fire
 * @description Manually fires the event on the element
 * @return 		{void}
 */
	
	fire: function() {
		return this.config.element.dispatchEvent(this.config.event);
	},

/**
 * @method 		onFire
 * @description Called during event firing
 * @return 		{void}
 */
	
	onFire: function() {
		if(this.stopped) return;
		
		if(arguments[0])
			this.lastEvent = arguments[0];			

		this.config.handler.apply(this.config.scope, arguments);
		
		if(this.single)
			this.stop();
	},

/**
 * @method 		resume
 * @description Adds or re-adds the event listener to the element
 * @return 		{void}
 */
	
	resume: function() {
		if(!this.config.event) return;
		this.stopped = false;
		this.config.element.addEventListener(
			this.config.event, 
			this.onFire, 
			this.config.useCapture, 
			this.config.priority, 
			this.config.useWeakReference
		);	
	}	
};
