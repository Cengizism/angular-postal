define(["services/services"],function(e){e.factory("Player",["$rootScope","$timeout","Store",function(e,t,n){var r={list:function(){return _.toArray(n("players").all())},save:function(e){var t=e.id?e.id:Date.now(),r={id:t,name:_.isUndefined(e.name)?"- No name - "+t:e.name,position:_.isUndefined(e.position)?"- No position -":e.position,goals:_.isUndefined(e.goals)?0:e.goals};e.hasOwnProperty("team")&&!_.isNull(e.team)&&(r.team=e.team),n("players").save(t,r)},remove:function(e){n("players").remove(e.id)}};return{list:function(e,t){e(r.list(),t)},save:{self:function(e,t){r.save(e.player),e.callback(t)},before:function(e,t,n){e(t,n)},after:function(){console.log("after save action ->",arguments[1])},failed:function(e){console.log("error here ->",e)}},remove:function(e,t){r.remove(e),e.callback(t)},promised:{list:function(e,n){t(function(){n.reply({list:r.list()})},1)}},block:{save:function(){e.$bus.unsubscribe({channel:"players",topic:"player.save"})}},all:{save:function(e,t){console.log("player save action!",t)},remove:function(e,t){console.log("player delete action!",t)}}}}])});