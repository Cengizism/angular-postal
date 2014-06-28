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
              return angular.fromJson(localStorage.getItem('players'));
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