define(
  ['app','postal'],
  function (app, postal)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$q', 'Broker', 'Diagnostics',
        function($rootScope, $q, Broker, Diagnostics)
        {
          Broker.initialize();

          if (!angular.isDefined(postal.configuration.promise)) { postal.configuration.promise = {} }

          postal.configuration.promise.createDeferred = function () { return $q.defer() };

          postal.configuration.promise.getPromise = function (deferred) { return deferred.promise };

          Diagnostics.initialize(
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


        }
      ]
    );
  }
);