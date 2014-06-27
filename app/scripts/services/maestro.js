define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory('Maestro',
      [
        '$rootScope',
        function ($rootScope)
        {

          $rootScope.$bus.subscribe(
            {
              channel: 'orders',
              topic: 'order.new',
              callback: function (data, envelope)
              {
                console.log('it worked', data, envelope);

                localStorage['test'] = 'yes! it worked!';
              }
            }
          );


        }
      ]
    );
  }
);