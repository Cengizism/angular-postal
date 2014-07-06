define(
  ['app', 'postal'],
  function (app, postal)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$q', 'Broker', 'Team', 'Player',
        function($rootScope, $q, Broker, Team, Player)
        {
          Broker.initialize(
            {
              modules: {
                teams: Team,
                players: Player
              },
              logs: {
                system: [{ channel: 'postal' }],
                actions: [
                  { channel: 'teams' },
                  { channel: 'players' }
                ]
              }
            }
          );


          /**
           * ---------------------------------------------------------------------------------
           */
          $rootScope.showSubscriptions = function ()
          {
            console.log('teams ->', $rootScope.$bus.subscriptions.teams);
            console.log('players ->', $rootScope.$bus.subscriptions.players);
          };

          $rootScope.unsubscribeSavers = function ()
          {
            $rootScope.$bus.publish(
              {
                channel: 'players',
                topic: 'player.block.save'
              }
            );
          };
        }
      ]
    );
  }
);