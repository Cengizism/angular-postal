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

              var _player = {
                id: id,
                name: (_.isUndefined(player.name)) ? '- No name - ' + id : player.name,
                position: (_.isUndefined(player.position)) ? '- No position -' : player.position,
                goals: (_.isUndefined(player.goals)) ? 0 : player.goals
              };

              if (player.hasOwnProperty('team') && ! _.isNull(player.team))
              {
                _player.team = player.team;
              }

              Store('players').save(
                id,
                _player
              );
            },

            remove: function (player) { Store('players').remove(player.id) }
          };

        }
      ]
    );
  }
);