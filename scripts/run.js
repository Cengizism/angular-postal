define(["app","config"],function(e,t){e.run(["$rootScope","$q","Broker","Store","Team","Player",function(e,n,r,i,s,o){r.initialize({modules:{teams:s,players:o},logs:["teams","players"]}),r.link({channel:"players",topic:"players.promised.list"},{channel:"testing",topic:"tested.method"}),e.privilage=function(t,n,i){if(t=="*")switch(n){case"save":e.broker.auth.players["players.save"]=i,e.broker.auth.teams["teams.save"]=i,i?(r.enable("players","players.save"),r.enable("teams","teams.save")):(r.disable("players","players.save"),r.disable("teams","teams.save"));break;case"remove":e.broker.auth.players["players.remove"]=i,e.broker.auth.teams["teams.remove"]=i,i?(r.enable("players","players.remove"),r.enable("teams","teams.remove")):(r.disable("players","players.remove"),r.disable("teams","teams.remove"))}else e.broker.auth[t][n]?r.enable(t,n):r.disable(t,n)},e.showSubscriptions=function(){console.log("teams ->",r.subscriptions.teams),console.log("players ->",r.subscriptions.players),console.log("broker ->",e.broker)},e.unsubscribeSavers=function(){r.disable("players","players.save")},e.registerSubscriptions=function(){r.enable("players","players.save")},e.nuke=function(){r.reset()},angular.element("#wrap").show();var u=[{id:1,name:"Barcelona"},{id:2,name:"Real Madrid"}],a=[{id:1,name:"Di Maria",position:3,goals:5,team:2},{id:2,name:"Messi",position:2,goals:9,team:1},{id:3,name:"Ronaldo",position:3,goals:8,team:2}];_.each(u,function(e){i("teams").save(e.id,{id:e.id,name:e.name})}),_.each(a,function(e){i("players").save(e.id,{id:e.id,name:e.name,position:t.app.positions[e.position],goals:e.goals,team:e.team})})}])});