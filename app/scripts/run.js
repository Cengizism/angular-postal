define(
  ['app', 'postal'],
  function (app, postal)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$q', 'Broker',
        function($rootScope, $q, Broker)
        {
          Broker.initialize(
            {
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