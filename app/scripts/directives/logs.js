define(
  ['directives/directives'],
  function (directives)
  {
    'use strict';

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