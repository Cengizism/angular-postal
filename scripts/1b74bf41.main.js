window.location.port=="8080"&&document.getElementsByTagName("html")[0].setAttribute("ng-app"),require.config({paths:{angular:"../vendors/angular/angular.min",jquery:"../vendors/jquery/jquery.min",bootstrap:"../vendors/bootstrap-sass/dist/js/bootstrap.min",domReady:"../vendors/requirejs-domready/domReady",lawnchair:"../vendors/lawnchair/src/Lawnchair",dom:"../vendors/lawnchair/src/adapters/dom",underscore:"../vendors/underscore/underscore",lodash:"../vendors/lodash/dist/lodash.min",conduitjs:"../vendors/conduitjs/lib/conduit.min",postal:"../vendors/postal.js/lib/postal.min",diagnostics:"../vendors/postal.diagnostics/lib/postal.diagnostics.min",request:"../vendors/postal.request-response/lib/postal.request-response.min"},shim:{angular:{deps:["jquery"],exports:"angular"},bootstrap:{deps:["jquery"],exports:"bootstrap"},dom:{deps:["lawnchair"]}}}),require(["angular","app","domReady","postal","diagnostics","request","bootstrap","lawnchair","dom","run","config","services/broker","modals/player","modals/team","controllers/teamsCtrl","controllers/playersCtrl","services/store","directives/logs","filters/translate"],function(e,t,n,r){t.config(["$provide",function(e){e.decorator("$rootScope",["$delegate",function(e){return Object.defineProperty(e.constructor.prototype,"$bus",{get:function(){return{subscribe:function(){var e=r.subscribe.apply(r,arguments);this.$on("$destroy",function(){e.unsubscribe()})}.bind(this),channel:r.channel,publish:r.publish,unsubscribe:r.unsubscribe,link:r.linkChannels,promise:{},request:r.request}},enumerable:!1}),e}])}]),n(function(){e.bootstrap(document,["ngPostal"])})});