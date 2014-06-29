define(
  ['app', 'postal'],
  function (app, postal)
  {
    'use strict';

    app.run(
      [
        '$rootScope', '$q',
        function($rootScope, $q)
        {
          if (!angular.isDefined(postal.configuration.promise)) { postal.configuration.promise = {} }

          postal.configuration.promise.createDeferred = function () { return $q.defer() };

          postal.configuration.promise.getPromise = function (deferred) { return deferred.promise };

          $rootScope.logs = [];

          new postal.diagnostics.DiagnosticsWireTap(
            {
              name: 'console',
              writer: function (message)
              {
                $rootScope.logs.unshift(
                  angular.extend(
                    angular.fromJson(message),
                    { fold: false }
                  )
                );
              }
            }
          );
        }
      ]
    );
  }
);