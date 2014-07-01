define(
  ['app','postal'],
  function (app, postal)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$q', 'Diagnostics',
        function($rootScope, $q, Diagnostics)
        {
          if (!angular.isDefined(postal.configuration.promise)) { postal.configuration.promise = {} }

          postal.configuration.promise.createDeferred = function () { return $q.defer() };

          postal.configuration.promise.getPromise = function (deferred) { return deferred.promise };


          Diagnostics.initialize(
            {
              system: [{ channel: 'postal' }],
              actions: [{ channel: 'players' }]
            }
          );

        }
      ]
    );
  }
);