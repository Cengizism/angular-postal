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
              logs: ['teams', 'players']
            }
          );

          Broker.link(
            {
              channel: 'players',
              topic: 'players.promised.list'
            },
            {
              channel: 'testing',
              topic: 'tested.method'
            }
          );

          /**
           * ---------------------------------------------------------------------------------
           */
          $rootScope.showSubscriptions = function ()
          {
            console.log('teams ->', Broker.subscriptions.teams);
            console.log('players ->', Broker.subscriptions.players);
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

          $rootScope.reset = function ()
          {
            Broker.reset();
          };
        }
      ]
    );
  }
);