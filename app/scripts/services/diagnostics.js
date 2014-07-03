define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Diagnostics',
      [
        '$rootScope',
        function ($rootScope)
        {
          return {
            initialize: function (logs)
            {

            }
          };
        }
      ]
    );
  }
);