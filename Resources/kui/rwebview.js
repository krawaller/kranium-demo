var cross = function(){
(function(global){
	var K = (global.K = global.K || {}), callbacks = {}, cid = 0, me = this, toString = Object.prototype.toString;

	K.isFunc = function(o){ return toString.call(o) === "[object Function]"; };
	K.reg = function(obj, reglabel) {
		var lb = '_' + reglabel;

		if(typeof Ti !== 'undefined'){
			Ti.App.addEventListener(lb, function(e){
				//K.log && K.log('e', e);
				
				try {
			    	var data = e.data; //typeof e.data === 'string' ? eval('(' + e.data + ')') : e.data; // JSON.parse seem to be broken on Android
					if(!e.method){
						if(callbacks[e.cid]){
							callbacks[e.cid](data);
							delete callbacks[e.cid];
						}
					} else {
					    var i = 0, m = e.method.split("."), tmp, val, ctx, o = obj, os = [], fn = function(val){
							if(e.cid){ 
							    Ti.App.fireEvent('_' + e.source, { cid: e.cid, data: val, source: lb }); 
							}
						};

					    while((tmp = o[m[i++]]) && (o = tmp) && os.push(o));

					    if(o && (K.isFunc(o))){
					        ctx = os[os.length - 2] || obj;
					        tmp = data ? ((data instanceof Array) ? data : [data]) : [];
					        tmp.push(fn);
					        tmp.push(e);
					        val = o.apply ? o.apply(ctx, tmp) : o(data[0], data[1], data[2]);
					        if(typeof (val) !== 'undefined'){
					            fn(val);
					        }
					    } else {
					        fn(o);
					    }
					}
				} catch(e){
					alert(JSON.stringify(e));
					if(typeof K === 'object' && K.log){
						K.log(e);
					} else if(typeof document !== 'undefined' && document.body){
						document.body.innerHTML = JSON.stringify(e);
					}
				}
			});
		}
	
		return function(label, method, data, callback) {
			if(K.isFunc(data) && typeof callback === 'undefined'){
				callback = data;
				data = null;
			}
			cid++;
			callbacks[cid] = callback;
		
			if(typeof Ti !== 'undefined'){
				Ti.App.fireEvent('_' + label, { method: method, cid: callback ? cid : false, source: reglabel, data: JSON.stringify(data) });
			}
		};
	};
})(this);
};

cross();
//K.reg(this, 'app');

exports.Class = WebView.extend({
	init: function(o) {
		
		var url = o.url,
			webview;
		
		//o.url = this.url = null;
		//o.html = this.html = '<html><head></head><body></body></html>';
		
		this._super(o);
		webview = this.el;
		
		var id = 'webview-' + webview._uuid,
			appId = 'app-' + id,
			webId = 'web-' + id;
		
		var _call = K.reg(o.expose || (webview.expose = {}), appId);
		webview.call = function(method, data, callback){
			_call(webId, method, data, callback);
		};
		
		webview.addEventListener('beforeload', beforeload);
		w = webview;
		function beforeload(e) {
			K.log('beforeload', {
				event: e,
				"webview._url": webview._url,
				"e.url": e.url
			});
			
			e = e || {};
			e.url = e.url || url;
			
			if(webview._url !== e.url){
				K.log(' ========= was not same');
				
				webview.stopLoading();
				var base = e.url.replace(/[^\/]*$/, function($0) {
					return $0.indexOf('.') !== -1 ? '' : $0 + '/';
				});
			
				K.ajax({
					url: e.url,
					dataType: 'text',
					success: function(data) {
						data = data.replace('<head>', '<head><base href="' + base + '" />' + '<script>' + cross.toString().replace(/^\s*function\s*\([^\)]*\)\s*\{/, '').replace(/\}\s*$/, '') + '; var Native = (function(){ var call = K.reg(window, "' + webId + '"); return { call: function(method, data, callback){ return call("' + appId + '", method, data, callback); } } })();</script>');
						//K.log(data);
						webview._url = e.url;
						webview.html = data;
					}
				});
			}
		}
		
		webview.addEventListener('load', function(e){
			K.log(' ====== loaded');
			webview.call('document.getElementsByTagName("form").length', function(t){
				K.log(' ================ title: ', t);
			})
		});
	}
});
