define(
  ['services/services'],
  function (services)
  {
    'use strict';

    services.factory(
      'Player',
      [
        '$rootScope', '_Store',
        function ($rootScope, _Store)
        {
          return {
            list: function ()
            {
              var list = _Store.get();

              if (_.isUndefined(list)) _Store.set([]);

              console.log('data ->', list || []);

              return list || [];
            },
            save: function (data)
            {
              console.log('data ->', data);

              data.player.goals = (_.isUndefined(data.player.goals)) ? 0 : data.player.goals;

              var players = _Store.get();

              if (data.player.id)
              {
                var index = _.indexOf(
                  players,
                  _.find(players, function (_player) { return _player.id == data.player.id })
                );

                players[index] = data.player;
              }
              else
              {
                players.push(
                  {
                    id: Date.now(),
                    name: data.player.name,
                    position: data.player.position,
                    goals: data.player.goals
                  }
                );
              }

              _Store.set(players);

              return this.list();
            },
            remove: function (data)
            {
              _Store.set(
                _.filter(
                  _Store.get(),
                  function (player) { return player.id != data.id }
                )
              );

              return _Store.get()
            }
          };

        }
      ]
    );
  }
);