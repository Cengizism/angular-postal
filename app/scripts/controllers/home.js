define(
  ['controllers/controllers'],
  function (controllers)
  {
    'use strict';

    controllers.controller(
      'home',
      [
        '$scope',
        function ($scope)
        {

          $scope.passIt = function ()
          {
            $scope.$bus.publish(
              {
                channel: 'orders',
                topic: 'order.new',
                data: {
                  name: 'Cengiz',
                  profession: 'Engineer'
                }
              }
            );
          };

        }
      ]
    );
  }
);