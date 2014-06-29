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

              return (players) ? angular.fromJson(players) : this.set([]);
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