define(["controllers/controllers"],function(e){e.controller("teamsCtrl",["$scope","$timeout",function(e,t){e.team={},e.teams=[];var n=e.$bus.channel("teams");e.Team={list:function(){n.publish("team.list",function(t){e.teams=t})},save:function(t){n.publish({topic:"team.save",data:{team:t,callback:function(){this.list()}.bind(this)}}),e.team={},e.$bus.publish({channel:"players",topic:"player.team.list"})},remove:function(e){n.publish({topic:"team.remove",data:{id:e,callback:function(){this.list()}.bind(this)}})},edit:function(t){e.team=angular.extend({},t)}},t(function(){e.Team.list()}),e.clearForm=function(){e.team={}}}])});