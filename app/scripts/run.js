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
          Broker.initialize();

          Broker.diagnostics(
            {
              system: [{ channel: 'postal' }],
              actions: [
                { channel: 'teams' },
                { channel: 'players' }
              ]
            }
          );

          $rootScope.showSubscriptions = function ()
          {
            console.log('subscriptions ->', $rootScope.$bus.subscriptions);
          };



          /**
           * ---------------------------------------------------------------------------------
           */
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