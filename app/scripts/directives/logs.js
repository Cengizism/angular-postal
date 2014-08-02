define(
  ['directives/directives'],
  function (directives)
  {
    'use strict';

    // TODO: Check whether any directive methods are needed
    directives.directive(
      'logs',
      [
        function ()
        {
          return {
            restrict: 'E',
            templateUrl: './views/logs.html',
            scope: {
              data: '='
            },
            link: function (scope, elm, attrs)
            {
            }
          };
        }
      ]
    );
  }
);