define(
  ['services/services'],
  function (services)
  {
    'use strict';

    // TODO: Turn it to an initable instance with any given channel and subscribe methods

    services.factory(
      'eventBus',
      [
        '$rootScope', 'Store',
        function ($rootScope, Store)
        {
          return {
            init: function (channel) {},

            subscribe: function ()
            {

              $rootScope.$bus.subscribe(
                {
                  channel: 'players',
                  topic: 'player.list',
                  callback: function (data, envelope)
                  {
                    var list = Store.get();

                    if (_.isUndefined(list)) Store.set([]);

                    data.callback(list || [], envelope);
                  }
                }
              );

              $rootScope.$bus.subscribe(
                {
                  channel: 'players',
                  topic: 'player.save',
                  callback: function (data, envelope)
                  {
                    data.player.goals = (_.isUndefined(data.player.goals)) ? 0 : data.player.goals;

                    var players = Store.get();

                    if (data.player.id)
                    {
                      var index = _.indexOf(
                        players, _.find(
                          players,
                          function (_player) { return _player.id == data.player.id }
                        )
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

                    Store.set(players);

                    data.callback(players);
                  }
                }
              );

              $rootScope.$bus.subscribe(
                {
                  channel: 'players',
                  topic: 'player.delete',
                  callback: function (data, envelope)
                  {
                    Store.set(
                      _.filter(
                        Store.get(),
                        function (player) { return player.id != data.id }
                      )
                    );

                    data.callback(Store.get());
                  }
                }
              );

            }
          }


        }
      ]
    );
  }
);