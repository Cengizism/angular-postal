define(["app","postal"],function(e,t){e.run(["$rootScope","$q",function(e,n){angular.isDefined(t.configuration.promise)||(t.configuration.promise={}),t.configuration.promise.createDeferred=function(){return n.defer()},t.configuration.promise.getPromise=function(e){return e.promise},e.logs=[],new t.diagnostics.DiagnosticsWireTap({name:"console",writer:function(t){e.logs.unshift(angular.extend(angular.fromJson(t),{fold:!1}))}})}])});