define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Team',
      [
        '$rootScope', 'Store',
        function ($rootScope, Store)
        {
          return {
            list: function () { return _.toArray(Store('teams').all()) },

            save: function (team)
            {
              var id = (team.id) ? team.id : Date.now();

              Store('teams').save(
                id,
                {
                  id: id,
                  name: (_.isUndefined(team.name)) ? '' : team.name
                }
              );
            },

            remove: function (team) { Store('teams').remove(team.id) }
          };

        }
      ]
    );
  }
);