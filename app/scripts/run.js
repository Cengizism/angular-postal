define(
  ['app', 'postal'],
  function (app, postal)
  {
    'use strict';

    app.run(
      [
        '$rootScope', 'Players',
        function($rootScope, Players)
        {
          Players.subscribe();

          $rootScope.logs = [];

          new postal.diagnostics.DiagnosticsWireTap(
            {
              writer: function (message) { $rootScope.logs.push(message) }
            }
          );
        }
      ]
    );
  }
);