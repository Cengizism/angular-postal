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
            console.log('broker ->', $rootScope.broker);
          };

          $rootScope.unsubscribeSavers = function ()
          {
            Broker.disable('players', 'players.save');
          };

          $rootScope.registerSubscriptions = function ()
          {
            Broker.enable('players', 'players.save');
          };
        }
      ]
    );
  }
);