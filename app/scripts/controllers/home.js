define(
  ['controllers/controllers', 'config', 'postal'],
  function (controllers, config, postal)
  {
    'use strict';

    controllers.controller(
      'home',
      [
        '$scope',
        function ($scope)
        {
          console.log('config ->', $scope.$bus);

          $scope.naming = 'Cengiz';

          $scope.$bus.subscribe(
            {
              channel: 'orders',
              topic: 'order.new',
              callback: function (data, envelope)
              {
                console.log('it worked', data, envelope);
              }
            }
          );



          $scope.passIt = function ()
          {
            console.log('coming in here ?');

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