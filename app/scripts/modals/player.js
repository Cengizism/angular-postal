define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Player',
      [
        '$rootScope', 'Store',
        function ($rootScope, Store)
        {
          return {
            list: function () { return _.toArray(Store('players').all()) },

            save: function (player)
            {
              var id = (player.id) ? player.id : Date.now();

              Store('players').save(
                id,
                {
                  id: id,
                  team: (_.isUndefined(player.team)) ? null : player.team,
                  name: (_.isUndefined(player.name)) ? '' : player.name,
                  position: (_.isUndefined(player.position)) ? '' : player.position,
                  goals: (_.isUndefined(player.goals)) ? 0 : player.goals
                }
              );
            },

            remove: function (player) { Store('players').remove(player.id) }
          };

        }
      ]
    );
  }
);