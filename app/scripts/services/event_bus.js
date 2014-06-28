define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory('eventBus',
      [
        '$rootScope', 'Store',
        function ($rootScope, Store)
        {

          $rootScope.$bus.subscribe(
            {
              channel: 'players',
              topic: 'player.list',
              callback: function ()
              {
                var list = Store.get();

                if (_.isUndefined(list)) Store.set([]);

                console.log('list ->', list || []);

                return list || [];
              }
            }
          );

          //              $rootScope.$bus.subscribe(
          //                {
          //                  channel: 'orders',
          //                  topic: 'order.new',
          //                  callback: function (data, envelope)
          //                  {
          //                    console.log('it worked', data, envelope);
          //
          //                    localStorage['test'] = 'yes! it worked!';
          //                  }
          //                }
          //              );


//          return {
//            init: function (channel)
//            {
//
//            },
//
//            subscribe: function ()
//            {
//              console.log('inited!');
//
//            }
//          }


        }
      ]
    );
  }
);