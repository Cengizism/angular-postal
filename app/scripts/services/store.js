define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory('Store',
      [
        function ()
        {
          return {
            get: function ()
            {
              var players = localStorage.getItem('players');

              if (!players) { this.set([]) }

              return angular.fromJson(players);
            },
            set: function (data)
            {
              return localStorage.setItem('players', angular.toJson(data));
            }
          };
        }
      ]
    );
  }
);